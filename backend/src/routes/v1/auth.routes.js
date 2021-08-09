const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const router = express.Router();
const auth_controller = require("../../controllers/auth.controller");

// a simple test url to check that all of our files are communicating correctly.
router.get(`/test`, auth_controller.test);

//register
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

//login
router.post(
  `/login`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("password", "Password must be atleast 6 characters long.").isLength({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) auth_controller.login(params, res);
  }
);

//forgot password
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
//forgot password
router.post(
  `/verifyCode`,
  [
    check("email", "Email address is not valid").isEmail(),
    check("password", "Password must be atleast 6 characters long.").isLength({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      auth_controller.changePassword(params, res);
  }
);

//social Login
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

//change password
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

module.exports = router;
