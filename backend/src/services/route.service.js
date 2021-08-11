const httpStatus = require("http-status");
const { Token, Vehicle } = require("../models");
const ApiError = require("../helpers/ApiError");
const Route = require("../models/Route.model");

const saveRoute = async (params) => {
  return await Route.create(params);
};

const findRouteById = async (routeId) => {
  return await Route.findById(routeId);
};

const getPaginatedRoutesByUserId = async (userId, perPage, page) => {
  return await Route.find({ owner: userId })
    .limit(perPage)
    .skip(page * perPage);
};
const getRouteCountByOwnerId = async (userId) => {
  return await Route.find({ owner: userId }).count();
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
