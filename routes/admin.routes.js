const express = require("express");
const router = express.Router();

const { getPendingDrivers, approveDriver, rejectDriver } = require("../controllers/admin.controller");

router.get("/pending-drivers", getPendingDrivers);
router.patch("/approve-driver/:id", approveDriver);
router.patch("/reject-driver/:id", rejectDriver);

module.exports = router;