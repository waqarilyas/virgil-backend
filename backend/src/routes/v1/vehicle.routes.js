const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const vehicle_controller = require("../../controllers/vehicle.controller");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const bodyParser = require("body-parser");
/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle Routes Api Documentation
 */

const multer = require("multer");

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    console.log("---req---", req, ":---file---:", file);
    callback(null, "");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).single("photo");

/**
 * @swagger
 * /vehicle/getSingleVehicle:
 *   get:
 *     summary: Get Single Vehicle
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *             properties:
 *               vehicleId:
 *                 type: string
 *             example:
 *               vehicleId: '12'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicle:
 *                   $ref: '#/components/schemas/Vehicle'
 *       "400":
 *         description: Invalid VehicleId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Invalid Vehicle ID"
 */

router.get(
  `/getSingleVehicle`,
  [AUTHENTICATE, check("vehicleId", "VehicelId is invalid").not().isEmpty()],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      vehicle_controller.getVehicle(params, res);
    }
  }
);

/**
 * @swagger
 * /vehicle/getVehicles:
 *   get:
 *     summary: Get All Vehicles
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - page
 *               - perPage
 *             properties:
 *               userId:
 *                 type: string
 *               page:
 *                 type: number
 *               perPage:
 *                 type: number
 *             example:
 *               userID: '61110ff731fc32440f523766'
 *               page: 0
 *               perPage: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allVehicles:
 *                   $ref: '#/components/schemas/allVehicles'
 */

router.get(
  `/getVehicles`,
  [
    AUTHENTICATE,
    check("userId", "User uid is invalid").not().isEmpty(),
    check("page", "page is invalid").not().isEmpty(),
    check("perPage", "perPage is invalid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      vehicle_controller.getUserVehicles(params, res);
    }
  }
);

/**
 * @swagger
 * /vehicle/vehicleRegistration:
 *   post:
 *     summary: Register vehicle
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *               - manufacturer
 *             properties:
 *               userId:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               country:
 *                 type: string
 *               nickName:
 *                 type: string
 *               buildYear:
 *                 type: string
 *               enginePower:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *             example:
 *               userId: 265645646464
 *               manufacturer: kawasaki
 *               email: fake@example.com
 *               country: US
 *               nickName: Alam Channa
 *               buildYear: '2012'
 *               enginePower: 122cc
 *               vehicleType: car
 *               photo: fAYTSasdaGFDSFGDfgadsg
 */

router.post(
  `/vehicleRegistration`,
  [
    check("userId", "User uid is invalid").not().isEmpty(),
    check("email", "Email address is not valid").isEmail(),
    check("vehicleType", "Vehicle type is not valid").isIn(["car", "bike"]),
    check("photo", "Photo is not valid").optional(),
    check("buildYear", "BuildYear address is not valid").optional(),
    check("make", "make is not valid").not().isEmpty(),
    check("model", "model is not valid").not().isEmpty(),
    check("nickName", "NickName  is not valid").optional(),
    check("engineSize", "engineSize  is not valid").optional(),
    check("imageType", "imageType  is not valid").optional(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      vehicle_controller.vehicleRegistration(params, req.files, res);
    }
  }
);

module.exports = router;
