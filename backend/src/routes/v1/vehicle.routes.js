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
    callback(null, "");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).single("photo");

/**
 * @swagger
 * /vehicle/getSingleVehicle?vehicleId={vehicleId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Single Vehicle
 *     tags: [Vehicle]
 *     parameters:
 *      - in: path
 *        name: vehicleId
 *        schema:
 *          type: string
 *        required: true
 *        description: Vehicle ID
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
 * /vehicle/getVehicles?userId={userId}&page={page}&perPage={perPage}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Vehicles
 *     tags: [Vehicle]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User ID
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Vehicles per page
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
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               nickName:
 *                 type: string
 *               buildYear:
 *                 type: string
 *               enginePower:
 *                 type: string
 *               engineSize:
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
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicle:
 *                   $ref: '#/components/schemas/Vehicle'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

router.post(
  `/vehicleRegistration`,
  [
    AUTHENTICATE,
    check("userId", "User uid is invalid").not().isEmpty(),
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

router.put(
  `/updateVehicle`,
  [
    AUTHENTICATE,
    check("vehicleId", "Vehicle id is reqyured").notEmpty(),
    check("vehicleType", "Vehicle type is not valid").isIn(["car", "bike"]),
    check("buildYear", "BuildYear address is not valid").optional(),
    check("make", "make is not valid").not().isEmpty(),
    check("model", "model is not valid").not().isEmpty(),
    check("nickName", "NickName  is not valid").optional(),
    check("engineSize", "engineSize  is not valid").optional(),
    check("photo", "Photo is not valid").optional(),
    check("imageType", "imageType  is not valid").optional(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      vehicle_controller.updateVechile(params, req.files, req.userId, res);
    }
  }
);

module.exports = router;
