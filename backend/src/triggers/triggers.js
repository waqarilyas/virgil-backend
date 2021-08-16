const CONFIG = require("../config/default");
const EVENT = require("./custom-events").customEvent;
const LISTENERS = require("../controllers/listeners.controller");

EVENT.addListener("update-vehicle-in-user", LISTENERS.updateUserVehicle);
EVENT.addListener("update-route-in-user", LISTENERS.updateUserRoute);
EVENT.addListener("delete-route-in-user", LISTENERS.deleteRouteFromUser);
EVENT.addListener(
  "update-route-distance-in-vehicle",
  LISTENERS.updateVehicleDistance
);
