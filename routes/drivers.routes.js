const express = require("express");
const router = express.Router();

const { createDriver, getDrivers, getdriverById, updateDriver, deleteDriver } = require("../controllers/drivers.controller");

router.post("/", createDriver);
router.get("/", getDrivers);
router.get("/:id", getdriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver)

module.exports = router;