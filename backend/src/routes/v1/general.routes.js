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

module.exports = router;
