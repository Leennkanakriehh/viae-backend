const express = require("express");
const router = express.Router();

const { createVehicle, getVehicles, getVehicleById, getVehicleByDriver, updateVehicle, deleteVehicle } = require("../controllers/vehicles.controller");


router.post("/", createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.get("/driver/:driver_id", getVehicleByDriver);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);



module.exports = router;