const express = require("express");
const router = express.Router();

const adminAuth = require("./middleware/adminAuth");
const driverAuth = require("./middleware/driverAuth");

const { createRide, getRides, assignDriverToRide, startRide, completeRide, getMyRideHistory } = require("../controllers/rides.controller");

//admin only
router.post("/", adminAuth, createRide);
router.put("/:id/assign", adminAuth, assignDriverToRide);

//shared
router.get("/", getRides);

//driver
router.get("/my/history", driverAuth, getMyRideHistory);
router.put("/:id/complete", driverAuth, completeRide);
router.put("/:id/start", driverAuth, startRide);

router.put("/:id/start", driverAuth, startRide);
router.put("/:id/complete", driverAuth, completeRide);

module.exports = router;
