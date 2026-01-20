const express = require("express");
const router = express.Router();

const {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUserEmail,
} = require("../controllers/users.controller");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById)
router.delete("/:id", deleteUser);
router.put("/:id/email", updateUserEmail)

module.exports = router;