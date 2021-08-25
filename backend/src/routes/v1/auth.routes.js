const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const auth_controller = require("../../controllers/auth.controller");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               deviceId:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: fake
 *               lastName: NAme
 *               email: fake@example.com
 *               zipCode: '54000'
 *               city: New York
 *               country: US
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

router.post(
  `/register`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("firstName", "First Name is not provided").not().isEmpty(),
    check("lastName", "First Name is not provided").not().isEmpty(),
    check("password", "Password must be atleast 6 characters long.").isLength({
      min: 6,
    }),
    check("country", "Country name is not provided").not().isEmpty(),
    check("zipCode", "Zip code is not provided").not().isEmpty(),
    check("city", "City/State is not provided").not().isEmpty(),
    check("deviceId", "deviceId is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    if (HAS_ERROR(req, res) == false) {
      const params = matchedData(req, {
        onlyValidData: true,
      });
      auth_controller.register(params, res);
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - deviceId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               deviceId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               password: password1
 *               deviceId: asdaadas
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
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

//login
router.post(
  `/login`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("password", "Password must be atleast 6 characters long.").isLength({
      min: 6,
    }),
    check("deviceId", "deviceId is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) auth_controller.login(params, res);
  }
);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               code: '2350'
 */

router.post(
  `/forgotPassword`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("code", "Please provide a valid code").isLength({
      min: 4,
      max: 4,
    }),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      auth_controller.forgotPassword(params, res);
  }
);

/**
 * @swagger
 * /auth/socialLogin:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - platform
 *               - socialId
 *               - deviceId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               platform:
 *                 type: string
 *               socialId:
 *                 type: string
 *               deviceId:
 *                 type: string
 *             example:
 *               name: fake
 *               email: fake@example.com
 *               platform: 'google'
 *               socialId: jbsjhaffstahfsfdfgdsafg
 *               deviceId: usfatyfsdavscdgcagscdf
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

router.post(
  `/socialLogin`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("name", "Name is not valid").not().isEmpty(),
    check("platform", "Platform is not valid")
      .not()
      .isEmpty()
      .isIn(["facebook", "google", "apple"]),
    check("socialId", "SocialId is not valid").not().isEmpty(),
    check("deviceId", "deviceId is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) auth_controller.socialLogin(params, res);
  }
);

/**
 * @swagger
 * /auth/changePassword:
 *   post:
 *     summary: Change Password
 *     description: User password will be changed
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               password: 'asjhvdhvahjs'
 */

router.post(
  `/changePassword`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("password", "Invalid Code").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      auth_controller.changePassword(params, res);
  }
);

router.post(`/logout`, [AUTHENTICATE], (req, res, next) => {
  const params = matchedData(req, {
    onlyValidData: true,
  });
  params.userId = req.userId;
  if (HAS_ERROR(req, res) == false) auth_controller.logout(params, res);
});

module.exports = router;
