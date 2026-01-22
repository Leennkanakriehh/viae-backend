const express = require("express");
const router = express.Router();
const adminAuth = require("./middleware/adminAuth");

const {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUserEmail,
} = require("../controllers/users.controller");

router.post("/", adminAuth, createUser);
router.get("/", adminAuth, getUsers);
router.get("/:id", adminAuth, getUserById);
router.delete("/:id", adminAuth, deleteUser);
router.put("/:id/email", adminAuth, updateUserEmail);

module.exports = router;