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

/**
 * @swagger
 * /general/getUserReviews?userId={userId}&page={page}&perPage={perPage}&:
 *   get:
 *     summary: get Reviews
 *     tags: [General]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: user ID
 *      - in: path
 *        name: page
 *        schema:
 *          type: integer
 *        required: true
 *        description: page number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: integer
 *        required: true
 *        description: Number of Routes per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Reviews:
 *                   $ref: '#/components/schemas/Reviews'
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
    if (HAS_ERROR(req, res) == false)
      general_controller.getUserReviews(params, res);
  }
);

/**
 * @swagger
 * /general/getUserActivityLog?userId={userId}&page={page}&perPage={perPage}&:
 *   get:
 *     summary: get user activity log
 *     tags: [General]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: user ID
 *      - in: path
 *        name: page
 *        schema:
 *          type: integer
 *        required: true
 *        description: page number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: integer
 *        required: true
 *        description: Number of Routes per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserActivityLog:
 *                   $ref: '#/components/schemas/ActivityLog'
 */

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

router.post(
  `/testNotification`,
  [check("deviceId", "deviceId is not valid").not().isEmpty()],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    if (HAS_ERROR(req, res) == false) params.userId = req.userId;
    general_controller.notificationTest(params, res);
  }
);

router.post(
  `/inviteToRide`,
  [
    check("receivers", "receivers are not valid").not().isEmpty(),
    check("routeId", "routeId is not valid").not().isEmpty(),
    check("message", "message is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    if (HAS_ERROR(req, res) == false) params.userId = req.userId;
    general_controller.inviteToRide(params, res);
  }
);

router.get(
  `/getUserNotifications`,
  [AUTHENTICATE, check("userId", "userId is not valid").not().isEmpty()],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    general_controller.getUserNotifications(params, res);
  }
);

router.get("/delete-routes", general_controller.deleteRoutes);

module.exports = router;
