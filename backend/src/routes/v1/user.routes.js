const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const router = express.Router();
const user_controller = require("../../controllers/user.controller");

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

/**
 * @swagger
 * /user/getSingleUser?id={userId}:
 *   get:
 *     summary: Get User Information
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       "400":
 *         description: Invalid UserId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Invalid UserId"
 */

router.get(
  `/getSingleUser`,
  [check("id", "User uid is invalid").not().isEmpty()],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      user_controller.getUser(params, res);
    }
  }
);

/**
 * @swagger
 * /user/addFriend?id={userId}:
 *   get:
 *     summary: Send Friend Request
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       "400":
 *         description: Invalid UserId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Invalid UserId"
 */

router.get(
  `/addFriend`,
  [check("id", "User uid is invalid").not().isEmpty()],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      user_controller.getUser(params, res);
    }
  }
);

/**
 * @swagger
 * /user/getAllUsers?page={page}&perPage={perPage}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Basic Information about all the users
 *     tags: [User]
 *     parameters:
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
 *        description: Number of Users per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   $ref: '#/components/schemas/allUsers'
 */

router.get(
  `/getAllUsers`,
  [
    AUTHENTICATE,
    check("page", "page is not valid").not().isEmpty(),
    check("perPage", "perPage is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      params.userId = req.userId;
      user_controller.getAllUsers(params, res);
    }
  }
);

router.get(
  `/getUserFriends`,
  [
    AUTHENTICATE,
    check("page", "page is not valid").not().isEmpty(),
    check("perPage", "perPage is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      params.userId = req.userId;
      user_controller.getUserFriends(params, res);
    }
  }
);

module.exports = router;
