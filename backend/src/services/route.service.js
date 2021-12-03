const httpStatus = require("http-status");
const { Token, Vehicle } = require("../models");
const ApiError = require("../helpers/ApiError");
const Route = require("../models/Route.model");
const Stop = require("../models/Stop.model");

const saveRoute = async (params) => {
  return await Route.create(params);
};

const updateRoute = async (routeId, params) => {
  return await Route.findOneAndUpdate({ _id: routeId }, params);
};

const findRouteById = async (routeId) => {
  return await Route.findById(routeId).lean();
};

const getPaginatedRoutesByUserId = async (userId, perPage, page) => {
  return await Route.find({ owner: userId })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean()
    .populate("stops")
    .populate("owner", "firstName lastName")
    .sort({ createdAt: -1 });
};
const getRouteCountByOwnerId = async (userId) => {
  return await Route.find({ owner: userId }).countDocuments();
};

const deleteRouteById = async (routeId) => {
  return await Route.findOneAndDelete({ _id: routeId });
};

const deleteStopsOfRoute = async (routeId) => {
  return await Stop.deleteMany({ routeId: routeId });
};

module.exports = {
  saveRoute,
  updateRoute,
  findRouteById,
  getPaginatedRoutesByUserId,
  getRouteCountByOwnerId,
  deleteRouteById,
  deleteStopsOfRoute,
};
