const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const router = express.Router();
const request_controller = require("../../controllers/request.controller");

/**
 * @swagger
 * tags:
 *   name: Request
 *   description: Request related api documentation
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

/**
 * @swagger
 * /request/sendFriendRequest?requestFrom={requestFrom}&requestTo={requestTo}&:
 *   get:
 *     summary: Send Friend Request
 *     tags: [Request]
 *     parameters:
 *      - in: path
 *        name: requestFrom
 *        schema:
 *          type: string
 *        required: true
 *        description: Request Sending user ID
 *      - in: path
 *        name: requestTo
 *        schema:
 *          type: string
 *        required: true
 *        description: Request Receiving user ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               name: message
 *               type: string
 *               example:
 *                   message: "Friend Request Sent Successfully"
 */

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

/**
 * @swagger
 * /request/handleFriendRequest:
 *   post:
 *     summary: Accept/Reject Friend Request
 *     tags: [Request]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - operation
 *             properties:
 *               requestId:
 *                 type: string
 *               operation:
 *                 type: string
 *             example:
 *               requestId: 61261db25ec64b2fe8f6941b
 *               operation: ACCEPT
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               name: message
 *               type: string
 *               example:
 *                   message: "Friend Request Handled Successfully"
 */

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

/**
 * @swagger
 * /request/getFriendRequests:
 *   get:
 *     summary: Get all friend requests
 *     tags: [Request]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserFriendRequests:
 *                   $ref: '#/components/schemas/FriendRequests'
 */

router.get(`/getFriendRequests`, [AUTHENTICATE], (req, res, next) => {
  if (HAS_ERROR(req, res) == false) {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    params.userId = req.userId;
    request_controller.getFriendRequests(params, res);
  }
});

module.exports = router;
