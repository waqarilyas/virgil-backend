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
module.exports = router;
