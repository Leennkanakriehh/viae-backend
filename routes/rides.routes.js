const express = require("express");
const router = express.Router();

const { createRide, assignDriverToRide, startRide, completeRide } = require("../controllers/rides.controller");

router.post("/", createRide);
router.put("/:id/assign", assignDriverToRide);
router.put("/:id/start", startRide);
router.put("/:id/complete", completeRide);

module.exports = router;
