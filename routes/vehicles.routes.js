const express = require("express");
const router = express.Router();
const adminAuth = require("./middleware/adminAuth");
const driverAuth = require("./middleware/driverAuth");
const { createVehicle, getVehicles, getVehicleById, getVehicleByDriver, updateVehicle, deleteVehicle } = require("../controllers/vehicles.controller");

router.get("/driver/:driver_id", driverAuth, getVehicleByDriver);

router.post("/", driverAuth, createVehicle);

router.put("/:id", driverAuth, updateVehicle);
router.delete("/:id", driverAuth, deleteVehicle);

router.get("/", adminAuth, getVehicles);
router.get("/:id", driverAuth, getVehicleById);

module.exports = router;