const express = require("express");
const router = express.Router();

const { getDrivers, getdriverById, updateDriver, deleteDriver, applyDriver } = require("../controllers/drivers.controller");

router.post("/apply", applyDriver);

router.get("/", getDrivers);
router.get("/:id", getdriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

module.exports = router;