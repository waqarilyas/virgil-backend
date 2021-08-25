const httpStatus = require("http-status");
const { Token, Vehicle } = require("../models");
const ApiError = require("../helpers/ApiError");
const Route = require("../models/Route.model");

const saveRoute = async (params) => {
  return await Route.create(params);
};

const findRouteById = async (routeId) => {
  return await Route.findById(routeId).lean();
};

const getPaginatedRoutesByUserId = async (userId, perPage, page) => {
  return await Route.find({ owner: userId })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .lean();
};
const getRouteCountByOwnerId = async (userId) => {
  return await Route.find({ owner: userId }).countDocuments();
};

const deleteRouteById = async (routeId) => {
  return await Route.findOneAndDelete({ _id: routeId });
};

module.exports = {
  saveRoute,
  findRouteById,
  getPaginatedRoutesByUserId,
  getRouteCountByOwnerId,
  deleteRouteById,
};
