const CONFIG = require("../config/default");
const EVENT = require("./custom-events").customEvent;
const LISTENERS = require("../controllers/listeners.controller");

EVENT.addListener("update-vehicle-in-user", LISTENERS.updateUserVehicle);
