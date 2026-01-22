const express = require("express");
const router = express.Router();
const adminAuth = require("./middleware/adminAuth");
const driverAuth = require("./middleware/driverAuth");
// Add a general auth if you have it, otherwise we'll use driverAuth
const { createVehicle, getVehicles, getVehicleById, getVehicleByDriver, updateVehicle, deleteVehicle } = require("../controllers/vehicles.controller");

// 1. MUST allow driverAuth here so the profile can load existing vehicle data
router.get("/driver/:driver_id", driverAuth, getVehicleByDriver);

// 2. Add driverAuth here so we know who is creating the vehicle
router.post("/", driverAuth, createVehicle);

router.put("/:id", driverAuth, updateVehicle);
router.delete("/:id", driverAuth, deleteVehicle);

router.get("/", adminAuth, getVehicles); // Keep admin only
router.get("/:id", driverAuth, getVehicleById);

module.exports = router;