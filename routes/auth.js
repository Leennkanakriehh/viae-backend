const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/signup", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const exists = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const result = await db.query(
            "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
            [email, password, role]
        );

        const user = result.rows[0];

        if (role === "driver") {
            const driverCode = `DRV-${user.id}`;
            const username = email.split("@")[0];

            await db.query(
                `INSERT INTO drivers (user_id, driver_code, username, status, is_online)
                 VALUES ($1, $2, $3, 'pending', false)`,
                [user.id, driverCode, username]
            );
        }

        res.status(201).json({ user });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// login unchanged
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await db.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2",
        [email, password]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role
    });
});

module.exports = router;
