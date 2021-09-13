const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const router = express.Router();
const request_controller = require("../../controllers/request.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related api documentation
 */
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: get a single user by id
 *     parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: true
 *        description: user uid
 *     responses:
 *        200:
 *          description: OK
 */

router.get(
  `/test`,
  //   [check("id", "User uid is invalid").not().isEmpty()],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      request_controller.test(params, res);
    }
  }
);

router.get(
  `/sendFriendRequest`,
  [
    AUTHENTICATE,
    check("requestFrom", "requestFrom is invalid").not().isEmpty(),
    check("requestTo", "requestTo is invalid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      request_controller.sendFriendRequest(params, res);
    }
  }
);

router.post(
  `/handleFriendRequest`,
  [
    AUTHENTICATE,
    check("requestId", "requestFrom is invalid").not().isEmpty(),
    check("operation", "requestTo is invalid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      request_controller.acceptRejectFriendRequest(params, res);
    }
  }
);

router.get(`/getFriendRequests`, [AUTHENTICATE], (req, res, next) => {
  if (HAS_ERROR(req, res) == false) {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    params.userId = req.userId;
    request_controller.getFriendRequests(params, res);
  }
});

router.post(
  `/removeFriend`,
  [
    AUTHENTICATE,
    check("friendId", "friendId is invalid").not().isEmpty(),
    check("userId", "userId is invalid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });

      request_controller.removeFriend(params, res);
    }
  }
);

module.exports = router;
