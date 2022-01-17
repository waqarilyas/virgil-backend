const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const { User } = require("../models");
const mongoose = require("mongoose");

const {
  saveRoute,
  getPaginatedRoutesByUserId,
  getRouteCountByOwnerId,
  deleteRouteById,
  deleteStopsOfRoute,
  updateRoute,
} = require("../services/route.service");
const EVENT = require("../triggers/custom-events").customEvent;
const Route = require("../models/Route.model");
const Comment = require("../models/Comment.model");
const { ROUTE_FILTERS, RIDER_REQUEST_TYPE } = require("../helpers/enums");

const test = (params, res) => {
  res.status(200).xxwsend({
    message: "Test successfull",
  });
};

const saveTrack = async (params, files, res) => {
  try {
    const {
      rideName,
      descriptors,
      isPublic,
      coordinates,
      owner,
      routeLength,
      vehicleId,
      stops,
      address,
      totalTimeTaken,
      description,
      chunckedArray,
    } = params;
    console.log("params:", params);
    const desc = JSON.parse(descriptors);
    const coords = JSON.parse(coordinates);
    const parsedStops = JSON.parse(stops);
    const parsedChunckedArray = JSON.parse(chunckedArray);
    const geoData = coords[0];

    console.log("parsed stops:", parsedStops);

    const routeLocation = {
      coordinates: [geoData.longitude, geoData.latitude],
    };

    const routeData = {
      rideName,
      description,
      descriptors: desc,
      isPublic,
      coordinates: coords,
      owner,
      routeLength,
      routeLocation,
      address,
      totalTimeTaken,
      chunckedArray: parsedChunckedArray,
    };

    let rt = await saveRoute(routeData);
    console.log("saved route:", rt);
    EVENT.emit("save-route-stops", {
      routeId: rt._id,
      stops: parsedStops,
      files,
    });

    if (files.length > 0) {
      const photo = await AUX.uploadToAws(
        files[0].buffer,
        `routes/${rt._id}/routeSnap`
      );
      const updatedRoute = await Route.findByIdAndUpdate(
        rt._id,
        {
          routeSnap: photo.Location,
        },
        { new: true }
      );
      rt = updatedRoute;
    }

    EVENT.emit("update-route-in-user", rt._id, owner);
    EVENT.emit("update-route-distance-in-vehicle", vehicleId, routeLength);
    EVENT.emit("update-activity-log", {
      userId: owner,
      message: "You saved a new route",
      extraInfo: {
        activityType: "SAVE_NEW_ROUTE",
        documentName: "routeId",
        relatedDocumentId: rt._id,
      },
    });

    res.status(200).send({
      message: "Route saved successfully",
      route: rt,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const updateTrack = async (params, files, res) => {
  try {
    const { routeId, coordinates, routeLength } = params;
    const coords = JSON.parse(coordinates);
    const geoData = coords[0];

    const routeLocation = {
      coordinates: [geoData.longitude, geoData.latitude],
    };

    const routeData = {
      coordinates: coords,
      routeLength,
      routeLocation,
    };
    let rt = await updateRoute(routeId, routeData);

    if (files.length > 0) {
      const photo = await AUX.uploadToAws(
        files[0].buffer,
        `routes/${rt._id}/routeSnap`
      );
      const updatedRoute = await Route.findByIdAndUpdate(
        rt._id,
        {
          routeSnap: photo.Location,
        },
        { new: true }
      );
      rt = updatedRoute;
    }

    EVENT.emit("update-activity-log", {
      userId: rt.owner,
      message: `You updated route ${rt.rideName}`,
      extraInfo: {
        activityType: "SAVE_NEW_ROUTE",
        documentName: "routeId",
        relatedDocumentId: rt._id,
      },
    });

    res.status(200).send({
      message: "Route saved successfully",
      route: rt,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const deleteTrack = async (params, res) => {
  try {
    const { routeId } = params;

    res.status(200).send({
      message: "Route deleted successfully",
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getSingleRoute = async (params, res) => {
  try {
    // await AUX.checkIfValidId(params.routeId, res);
    const route = await Route.findById(params.routeId)
      .lean()
      .populate({
        path: "stops reviews owner",
        populate: {
          path: "userId",
        },
      });
    if (route) {
      return res.status(httpStatus.OK).send({
        status: true,
        route,
      });
    }
    return AUX.apiResposne(
      res,
      httpStatus.BAD_REQUEST,
      false,
      "Route doesn't exist"
    );
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserRoutes = async (params, res) => {
  try {
    // await AUX.checkIfValidId(params.routeId, res);
    const route = await getPaginatedRoutesByUserId(
      params.userId,
      params.perPage,
      params.page
    );
    const count = await getRouteCountByOwnerId(params.userId);

    return res.status(httpStatus.OK).send({
      status: true,
      route,
      page: params.page,
      totalResults: count,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const deleteRoute = async (params, res) => {
  try {
    await AUX.emptyS3Directory(`routes/${params.routeId}/`);
    await deleteStopsOfRoute(params.routeId);
    const route = await deleteRouteById(params.routeId);
    EVENT.emit("delete-route-in-user", params.routeId, params.userId);

    if (route) {
      return res.status(httpStatus.OK).send({
        message: "route deleted successfully",
        status: true,
      });
    }
    return AUX.apiResposne(
      res,
      httpStatus.BAD_REQUEST,
      false,
      "Route doesn't exist"
    );
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const runRoute = async (params, res) => {
  try {
    const { routeId, userId, totalDistance, vehicleId } = params;

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      {
        lastRidden: Date.now(),
        $inc: { timesTaken: 1, totalDistanceCovered: totalDistance },
        $addToSet: { riddenBy: userId },
      },
      { new: true }
    );
    EVENT.emit("update-route-distance-in-vehicle", vehicleId, totalDistance);
    EVENT.emit("update-activity-log", {
      userId: userId,
      message: "You ran a route",
      extraInfo: {
        activityType: "RUN_ROUTE",
        documentName: "routeId",
        relatedDocumentId: routeId,
      },
    });
    EVENT.emit(
      "update-route-rider",
      routeId,
      userId,
      RIDER_REQUEST_TYPE.REMOVE
    );

    return res.status(httpStatus.OK).send({
      status: true,
      message: "route ran successfully",
      route: updatedRoute,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};
const onStartRun = async (params, res) => {
  const { routeId, userId } = params;

  EVENT.emit("update-route-rider", routeId, userId, RIDER_REQUEST_TYPE.ADD);

  return res.status(httpStatus.OK).send({
    status: true,
    message: "route ran successfully",
  });
};

const rateRoute = async (params, files, res) => {
  try {
    const { userId, route, comment, rating } = params;

    const review = await Comment.create({
      userId,
      route,
      message: comment,
      rating,
    });
    const rt = await Route.findById(route).populate("reviews");

    if (files?.length > 0) {
      EVENT.emit("upload-and-save-review-images", {
        files,
        review: review._id,
      });
    }

    const tRating = rt.reviews.reduce((a, b) => +a + +parseInt(b.rating), 0);

    const averageRating =
      (tRating + parseInt(rating)) / (rt?.reviews?.length + 1);

    const updatedRoute = await Route.findOneAndUpdate(
      { _id: route },
      {
        $push: { reviews: review._id },
        totalRating: averageRating.toFixed(0),
      },
      { new: true }
    );
    EVENT.emit("update-activity-log", {
      userId: userId,
      message: "You rated a route",
      extraInfo: {
        activityType: "RATE_ROUTE",
        documentName: "reviewId",
        relatedDocumentId: review._id,
      },
    });

    res.status(200).send({
      message: "Review added successfully",
      route: updatedRoute,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserListing = async (params, res) => {
  try {
    const { perPage, page, filter, lat, lang } = params;
    let geoJCoords = [parseFloat(lang), parseFloat(lat)];
    let near = {
      $geometry: {
        type: "Point",
        coordinates: geoJCoords,
      },
    };

    let filterValue = {
        $geoNear: {
          near: near,
          distanceField: "distance",
          spherical: true,
        },
      },
      sortObj;

    switch (filter) {
      case ROUTE_FILTERS.MOST_RIDDEN:
        sortObj = { $sort: { timesTaken: -1 } };
        break;
      case ROUTE_FILTERS.LEAST_RIDDEN:
        sortObj = { $sort: { timesTaken: 1 } };
        break;
      case ROUTE_FILTERS.SHORTEST_PATH:
        sortObj = { $sort: { routeLength: 1 } };
        break;
      case ROUTE_FILTERS.LONGEST_PATH:
        sortObj = { $sort: { routeLength: -1 } };
        break;
      case ROUTE_FILTERS.TOP_RATED:
        sortObj = { $sort: { totalRating: 1 } };
        break;
      case ROUTE_FILTERS.LEAST_RATED:
        sortObj = { $sort: { totalRating: -1 } };
        break;
      case ROUTE_FILTERS.MOST_STOPS:
        sortObj = { $sort: { numStops: -1 } };
        break;
      case ROUTE_FILTERS.LEAST_STOPS:
        sortObj = { $sort: { numStops: 1 } };
        break;

      case ROUTE_FILTERS.HOT_ROUTE:
        sortObj = { $sort: { numCurrentRiders: -1 } };
        near = {
          $maxDistance: 30000,
          $geometry: {
            type: "Point",
            coordinates: geoJCoords,
          },
        };
        filterValue = {
          $geoNear: {
            near: near,
            distanceField: "distance",
            spherical: true,
          },
        };

        break;

      case ROUTE_FILTERS.NEAR_ME:
        sortObj = { $sort: { distance: 1 } };
        near = {
          $maxDistance: 40233.6,
          $geometry: {
            type: "Point",
            coordinates: geoJCoords,
          },
        };
        filterValue = {
          $geoNear: {
            near: near,
            distanceField: "distance",
            spherical: true,
          },
        };

        break;
      default:
        sortObj = { $sort: { timesTaken: -1 } };
    }
    let query = [];

    query.push(filterValue);
    query.push(sortObj);
    query.push({ $limit: parseInt(perPage) });
    query.push({ $skip: page * perPage });
    query.push({ $match: { isPublic: true } });
    query.push({
      $lookup: {
        from: "stops",
        localField: "_id",
        foreignField: "routeId",
        as: "stops",
      },
    });

    const routes = await Route.aggregate(query);

    res.status(200).send({
      status: true,
      routes,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const addToFavourite = async (params, res) => {
  try {
    const { userId, routeId } = params;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { favouriteRoutes: routeId } },
      { new: true }
    ).populate("favouriteRoutes");

    res.status(200).send({
      status: true,
      user,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const removeRouteFromFavourites = async (params, res) => {
  try {
    const { userId, routeId } = params;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favouriteRoutes: routeId } },
      { new: true }
    ).populate("favouriteRoutes");

    res.status(200).send({
      status: true,
      user,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserFavouriteRoutes = async (params, res) => {
  try {
    const { userId, page, perPage } = params;

    const user = await User.findOne({ _id: userId })
      .populate("favouriteRoutes")
      .limit(parseInt(perPage))
      .skip(page * perPage);

    res.status(200).send({
      status: true,
      data: user.favouriteRoutes,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getMapData = async (params, res) => {
  try {
    console.log("params:", params);
    const { userId, lat, long, radius } = params;
    console.log("userId", userId);
    let query = [];
    let near = {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(long), parseFloat(lat)],
      },
      $maxDistance: parseInt(radius) * 1609.34,
    };

    let filterValue = {
      $geoNear: {
        near: near,
        distanceField: "routeLocation",
        spherical: true,
      },
    };
    console.log("filterValue:", filterValue);
    if (lat && long) {
      query.push(filterValue);
      // query.push({
      //   $match: { owner: { $ne: mongoose.Types.ObjectId(`${userId}`) } },
      // });
    } else {
      // query.push({
      //   // owner: { $ne: userId },
      //   $match: { owner: { $ne: mongoose.Types.ObjectId(`${userId}`) } },
      // });
    }

    query.push({ $match: { isPublic: true } });
    query.push({
      $lookup: {
        from: "User",
        localField: "_id",
        foreignField: "owner",
        as: "user",
      },
    });
    query.push({
      $lookup: {
        from: "Stop",
        localField: "_id",
        foreignField: "routeId",
        as: "stops",
      },
    });

    // const data = await Route.find(query).populate("stops")
    //   .populate("owner", ["firstName", "lastName"])
    //   .where("isPublic")
    //   .equals(true)
    //   .lean()
    const data = await Route.aggregate(query);
    console.log("data:", data);

    res.status(200).send({
      status: true,
      data,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  saveTrack,
  getSingleRoute,
  getUserRoutes,
  deleteRoute,
  runRoute,
  rateRoute,
  getUserListing,
  addToFavourite,
  getUserFavouriteRoutes,
  getMapData,
  removeRouteFromFavourites,
  onStartRun,
  updateTrack,
};
