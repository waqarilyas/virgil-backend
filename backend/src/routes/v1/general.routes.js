const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const general_controller = require("../../controllers/general.controller");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General Routes Api Documentation
 */

router.get(
  `/getUserReviews`,
  [
    AUTHENTICATE,
    check("userId", "userId is not valid").not().isEmpty(),
    check("page", "page is not valid").not().isEmpty(),
    check("perPage", "perPage is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    if (HAS_ERROR(req, res) == false) params.userId = req.userId;
    general_controller.getUserReviews(params, res);
  }
);

router.get(
  `/getUserActivityLog`,
  [
    AUTHENTICATE,
    check("userId", "userId is not valid").not().isEmpty(),
    check("page", "page is not valid").not().isEmpty(),
    check("perPage", "perPage is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    if (HAS_ERROR(req, res) == false)
      general_controller.getUserActivityLog(params, res);
  }
);

module.exports = router;
