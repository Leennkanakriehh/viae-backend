const express = require("express");
const router = express.Router();

const adminAuth = require("./middleware/adminAuth");
const driverAuth = require("./middleware/driverAuth");


const {
    applyDriver,
    getDrivers,
    getdriverById,
    updateDriver,
    deleteDriver,
    getMyDriverProfile,
    updateAvailability
} = require("../controllers/drivers.controller");

// driver apply
router.post("/apply", applyDriver);

// driver ONLY
router.get("/me", driverAuth, getMyDriverProfile);
router.put("/me/availability", driverAuth, updateAvailability);

//Admin ONLYY
router.get("/", adminAuth, getDrivers);
router.get("/:id", adminAuth, getdriverById);
router.put("/:id", adminAuth, updateDriver);
router.delete("/:id", adminAuth, deleteDriver);

module.exports = router;
