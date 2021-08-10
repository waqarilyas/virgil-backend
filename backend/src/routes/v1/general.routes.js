const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const general_controller = require("../../controllers/general.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

router.get(
  `/test`,
  [],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      general_controller.test(params, res);
    }
  }
);

module.exports = router;
