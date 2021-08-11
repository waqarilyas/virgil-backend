const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const general_controller = require("../../controllers/general.controller");

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General Routes Api Documentation
 */
/**
 * @swagger
 * /general/vehicleRegistration:
 *   post:
 *     summary: Register vehicle
 *     tags: [General]
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
    check("manufacturer", "Manufacturer address is not valid").not().isEmpty(),
    check("country", "Country address is not valid").not().isEmpty(),
    check("nickName", "NickName address is not valid").optional(),
    check("buildYear", "BuildYear address is not valid").optional(),
    check("enginePower", "EnginePower address is not valid").optional(),
    check("vehicleType", "Vehicle type is not valid").isIn(["car", "bike"]),
    check("photo", "Photo is not valid").optional(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      general_controller.vehicleRegistration(params, req.files, res);
    }
  }
);

module.exports = router;
