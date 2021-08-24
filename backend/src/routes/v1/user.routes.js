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
 * /user/getSingleUser:
 *   get:
 *     summary: Get User Information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: '61248002b6bd2b001613a242'
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
 * /user/addFriend:
 *   get:
 *     summary: Add Friend
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: '61248002b6bd2b001613a242'
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
 * /user/getAllUsers:
 *   get:
 *     summary: Basic Information about all the users
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *               - perPage
 *             properties:
 *               page:
 *                 type: number
 *               perPage:
 *                 type: number
 *             example:
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
      user_controller.getAllUsers(params, res);
    }
  }
);
module.exports = router;
