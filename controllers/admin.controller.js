const pool = require("../db");

//get pending users by admin 
exports.getPendingDrivers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
        d.id,
        d.driver_code,
        d.username,
        d.phone,
        d.status,
        u.email,
        u.role
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.status = 'pending'
      ORDER BY d.id DESC
    `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//approval
exports.approveDriver = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        // 1. get linked user
        const driverResult = await client.query(
            "SELECT user_id FROM drivers WHERE id = $1 FOR UPDATE",
            [id]
        );

        if (driverResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Driver not found" });
        }

        const userId = driverResult.rows[0].user_id;

        // 2. approve driver
        await client.query(
            "UPDATE drivers SET status = 'approved' WHERE id = $1",
            [id]
        );

        // 3. promote user role
        await client.query(
            "UPDATE users SET role = 'driver' WHERE id = $1",
            [userId]
        );

        await client.query("COMMIT");

        res.json({ message: "Driver approved successfully" });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Approval failed" });
    } finally {
        client.release();
    }
};



// reject 
exports.rejectDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE drivers SET status = 'rejected' WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }

        res.json({ message: "Driver rejected" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
