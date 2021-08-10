const express = require("express");
const multer = require("multer");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const general_controller = require("../../controllers/general.controller");

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});
const upload = multer({ storage }).single("image");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

router.post(
  `/vehicleRegistration`,
  upload,
  [
    check("userId", "User uid is invalid").not().isEmpty(),
    check("email", "Email address is not valid").isEmail(),
    check("manufacturer", "Manufacturer address is not valid").not().isEmpty(),
    check("country", "Country address is not valid").not().isEmpty(),
    check("nickName", "NickName address is not valid").optional(),
    check("buildYear", "BuildYear address is not valid").optional(),
    check("enginePower", "EnginePower address is not valid").optional(),
    check("vehicleType", "Vehicle type is not valid").isIn(["car", "bike"]),
    check("photo"),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      general_controller.vehicleRegistration(params, res);
    }
  }
);

module.exports = router;
