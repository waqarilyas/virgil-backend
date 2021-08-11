const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const router = express.Router();
const track_controller = require("../../controllers/track.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related api documentation
 */

router.get(`/test`, (req, res, next) => {
  if (HAS_ERROR(req, res) == false) {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    track_controller.test(params, res);
  }
});

router.post(
  `/saveRoute`,
  [
    AUTHENTICATE,
    check("rideName", "rideName is not valid").not().isEmpty(),
    check("descriptors", "descriptors are not valid").not().isEmpty(),
    check("isPublic", "isPublic is not valid").not().isEmpty(),
    check("coordinates", "coordinates is not valid").not().isEmpty(),
    check("routeSnap", "routeSnap is not valid").optional(),
    check("distanceCovered", "distanceCovered is not valid").not().isEmpty(),
    check("timeTaken", "timeTaken is not valid").not().isEmpty(),
    check("owner", "owner is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      track_controller.saveTrack(params, req.files, res);
  }
);

module.exports = router;
