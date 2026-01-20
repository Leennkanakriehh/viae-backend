const pool = require("../db");

exports.applyDriver = async (req, res) => {
    try {
        const { user_id, driver_code, name, phone } = req.body;

        const result = await pool.query(
            `INSERT INTO drivers (user_id, driver_code, name, phone, is_online)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
            [user_id, driver_code, name, phone]
        );
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                error: "User already has a driver application"
            });
        }

        if (err.code === "23503") {
            return res.status(400).json({
                error: "User does not exist"
            });
        }

        // NOT NULL 
        if (err.code === "23502") {
            return res.status(400).json({
                error: "Missing required field"
            });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}
//get all drivers
exports.getDrivers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT d.id, d.driver_code, d.username, d.phone, d.is_online, u.email
    FROM drivers d
    JOIN users u ON d.user_id = u.id
    WHERE d.status = 'approved'
    ORDER BY d.id;`
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get driver by id

exports.getdriverById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            ` SELECT
        d.id,
        d.driver_code,
        d.username,
        d.phone,
        d.is_online,
        u.email
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

//update driver 
exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone, is_online } = req.body;

        const result = await pool.query(
            `UPDATE drivers SET 
        username = COALESCE($1, username),
        phone = COALESCE($2, phone),
        is_online = COALESCE($3, is_online) WHERE id = $4  RETURNING *`,
            [username, phone, is_online, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//delete driver
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM drivers WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }

        res.status(200).json({ message: "Driver successfully deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

