const CONFIG = require("../config/default");
const EVENT = require("./custom-events").customEvent;
const LISTENERS = require("../controllers/listeners.controller");

EVENT.addListener("update-vehicle-in-user", LISTENERS.updateUserVehicle);
EVENT.addListener("delete-vehicle-in-user", LISTENERS.deleteVehicleInUser);

EVENT.addListener("update-route-in-user", LISTENERS.updateUserRoute);
EVENT.addListener("delete-route-in-user", LISTENERS.deleteRouteFromUser);
EVENT.addListener(
  "update-route-distance-in-vehicle",
  LISTENERS.updateVehicleDistance
);
EVENT.addListener("update-activity-log", LISTENERS.updateActivityLog);
EVENT.addListener("send-notification", LISTENERS.sendAndStoreNotification);
EVENT.addListener("update-request-in-user", LISTENERS.updateRequestInUser);
EVENT.addListener("save-route-stops", LISTENERS.saveRouteStops);

EVENT.addListener(
  "upload-and-save-review-images",
  LISTENERS.uploadReviewImages
);

EVENT.addListener("update-route-rider", LISTENERS.uploadReviewImages);
