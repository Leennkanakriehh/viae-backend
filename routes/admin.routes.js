const express = require("express");
const router = express.Router();

const adminAuth = require("./middleware/adminAuth");

const { getPendingDrivers, approveDriver, rejectDriver } = require("../controllers/admin.controller");

router.get("/pending-drivers", adminAuth, getPendingDrivers);
router.patch("/approve-driver/:id", adminAuth, approveDriver);
router.patch("/reject-driver/:id", adminAuth, rejectDriver);

module.exports = router;