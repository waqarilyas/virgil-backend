const express = require("express");
const { check, matchedData } = require("express-validator");
const { HAS_ERROR } = require("../../middlewares/error.middleware");
const { AUTHENTICATE } = require("../../middlewares/auth.middleware");
const router = express.Router();
const track_controller = require("../../controllers/track.controller");

/**
 * @swagger
 * tags:
 *   name: Track
 *   description: Track related api documentation
 */

router.get(`/test`, (req, res, next) => {
  if (HAS_ERROR(req, res) == false) {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    track_controller.test(params, res);
  }
});

/**
 * @swagger
 * /track/saveRoute:
 *   post:
 *     summary: Save New Route
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - rideName
 *               - descriptors
 *               - isPublic
 *               - coordinates
 *               - routeLength
 *               - timeTaken
 *               - owner
 *               - vehicleId
 *             properties:
 *               rideName:
 *                 type: string
 *               descriptors:
 *                 type: array
 *               isPublic:
 *                 type: boolean
 *               coordinates:
 *                 type: array
 *               routeSnap:
 *                 type: string
 *               routeLength:
 *                 type: number
 *               timeTaken:
 *                 type: number
 *               owner:
 *                 type: string
 *               vehicleId:
 *                 type: string
 *               imageType:
 *                 type: string
 *             example:
 *               rideName: Very nice ride
 *               descriptors: "[\"amazing\",\"rana\"]"
 *               isPublic: true
 *               coordinates: "[{\"latitude\":24.5,\"longitude\":35}]"
 *               routeSnap: Alam Channa
 *               routeLength: 24
 *               timeTaken: 168
 *               owner: 265645646464
 *               vehicleId: fAYTSasdaGFDSFGDfgadsg
 *               imageType: "image/png"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saveRoute:
 *                   $ref: '#/components/schemas/saveRoute'
 */

router.post(
  `/saveRoute`,
  [
    AUTHENTICATE,
    check("rideName", "rideName is not valid").not().isEmpty(),
    check("descriptors", "descriptors are not valid").not().isEmpty(),
    check("isPublic", "isPublic is not valid").not().isEmpty(),
    check("coordinates", "coordinates is not valid").not().isEmpty(),
    check("routeSnap", "routeSnap is not valid").optional(),
    check("routeLength", "routeLength is not valid").not().isEmpty(),
    check("timeTaken", "timeTaken is not valid").not().isEmpty(),
    check("owner", "owner is not valid").not().isEmpty(),
    check("vehicleId", "vehicleId is not valid").not().isEmpty(),
    check("imageType", "imageType  is not valid").optional(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      track_controller.saveTrack(params, req.files, res);
  }
);

/**
 * @swagger
 * /track/getSingleRoute:
 *   get:
 *     summary: Get Single Route
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *             properties:
 *               routeId:
 *                 type: string
 *             example:
 *               routeId: '611b5f049cc4fe0016756072'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 route:
 *                   $ref: '#/components/schemas/Route'
 *       "400":
 *         description: Route Does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Route Doesn't exist."
 */

router.get(
  `/getSingleRoute`,
  [AUTHENTICATE, check("routeId", "routeId is not valid").not().isEmpty()],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      track_controller.getSingleRoute(params, res);
  }
);

/**
 * @swagger
 * /track/getUserRoutes:
 *   get:
 *     summary: Get All Routes of a Specific User
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - page
 *               - perPage
 *             properties:
 *               userId:
 *                 type: string
 *               page:
 *                 type: number
 *               perPage:
 *                 type: number
 *             example:
 *               userID: '61110ff731fc32440f523766'
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
 *                 allRoutes:
 *                   $ref: '#/components/schemas/allRoutes'
 */

router.get(
  `/getUserRoutes`,
  [
    AUTHENTICATE,
    check("userId", "routeId is not valid").not().isEmpty(),
    check("page", "page is invalid").not().isEmpty(),
    check("perPage", "perPage is invalid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false)
      track_controller.getUserRoutes(params, res);
  }
);

/**
 * @swagger
 * /track/deleteRoute:
 *   delete:
 *     summary: Delete single route of a user
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - routeId
 *             properties:
 *               userId:
 *                 type: string
 *               routeId:
 *                 type: string
 *             example:
 *               userID: '61110ff731fc32440f523766'
 *               routeID: '61110ff731fc32440f523766'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               message:
 *                  type: string
 *             example:
 *               message: "Route Deleted Successfully"
 *       "400":
 *         description: Route Does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Route Doesn't exist."
 */

router.delete(
  `/deleteRoute`,
  [
    AUTHENTICATE,
    check("routeId", "routeId is not valid").not().isEmpty(),
    check("userId", "userId is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) track_controller.deleteRoute(params, res);
  }
);

/**
 * @swagger
 * /track/runRoute:
 *   post:
 *     summary: Run a Route
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - userId
 *               - totalDistance
 *               - vehicleId
 *             properties:
 *               routeId:
 *                 type: string
 *               userId:
 *                 type: string
 *               totalDistance:
 *                 type: number
 *               vehicleId:
 *                 type: string
 *             example:
 *               routeId: '611b5f049cc4fe0016756072'
 *               userId: '6114b125130bf70015a9dcf9'
 *               totalDistance: 25
 *               vehicleId: '611a013366fd1e2c7dc6cc89'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 runRoute:
 *                   $ref: '#/components/schemas/runRoute'
 *       "400":
 *         description: Route Does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Route Doesn't exist."
 */

router.post(
  `/runRoute`,
  [
    AUTHENTICATE,
    check("routeId", "routeId is not valid").not().isEmpty(),
    check("userId", "userId is not valid").not().isEmpty(),
    check("totalDistance", "totalDistance is not valid").not().isEmpty(),
    check("vehicleId", "vehicleId is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) track_controller.runRoute(params, res);
  }
);

/**
 * @swagger
 * /track/rateARoute:
 *   post:
 *     summary: Rate a Route
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - userId
 *               - comment
 *               - rating
 *             properties:
 *               routeId:
 *                 type: string
 *               userId:
 *                 type: string
 *               comment:
 *                 type: string
 *               rating:
 *                 type: number
 *             example:
 *               routeId: '611b5f049cc4fe0016756072'
 *               userId: '6114b125130bf70015a9dcf9'
 *               comment: 'This is a very nice route'
 *               rating: 3
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 runRoute:
 *                   $ref: '#/components/schemas/rateRoute'
 *       "400":
 *         description: Route Does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Route Doesn't exist."
 */

router.post(
  `/rateARoute`,
  [
    AUTHENTICATE,
    check("routeId", "routeId is not valid").not().isEmpty(),
    check("userId", "userId is not valid").not().isEmpty(),
    check("comment", "comment is not valid").not().isEmpty(),
    check("rating", "rating is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });

    if (HAS_ERROR(req, res) == false) track_controller.rateRoute(params, res);
  }
);

/**
 * @swagger
 * /track/getUserListing:
 *   get:
 *     summary: get routes of a user
 *     tags: [Track]
 *     parameters:
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
 *     example:
 *        page: 0
 *        perPage: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SinglePageRoutes:
 *                   $ref: '#/components/schemas/SinglePageRoutes'
 */

router.get(
  `/getUserListing`,
  [
    AUTHENTICATE,
    check("page", "page is not valid").not().isEmpty(),
    check("perPage", "perPage is not valid").not().isEmpty(),
  ],
  (req, res, next) => {
    const params = matchedData(req, {
      onlyValidData: true,
    });
    if (HAS_ERROR(req, res) == false) params.userId = req.userId;
    track_controller.getUserListing(params, res);
  }
);

module.exports = router;
