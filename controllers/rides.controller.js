const pool = require("../db");

exports.createRide = async (req, res) => {
    try {
        const { ride_code, pickup_location, destination } = req.body;

        if (!ride_code || !pickup_location || !destination) {
            return res.status(400).json({
                error: "ride_code, pickup_location, and destination are required"
            });
        }

        const result = await pool.query(
            `
      INSERT INTO rides (ride_code, pickup_location, destination)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [ride_code, pickup_location, destination]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                error: "Ride code already exists"
            });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}

//fetch rides
exports.getRides = async (req, res) => {
    try {
        const role = req.headers["x-role"];
        const userId = req.headers["x-user-id"];

        // ADMIN ==>all rides
        if (role === "admin") {
            const result = await pool.query(`
                SELECT
                  r.id,
                  r.ride_code,
                  r.pickup_location,
                  r.destination,
                  r.status,
                  r.requested_at,
                  r.driver_id,
                  d.username AS driver_name
                FROM rides r
                LEFT JOIN drivers d ON r.driver_id = d.id
                ORDER BY r.requested_at DESC
            `);

            return res.json(result.rows);
        }

        // DRIVER ==> only assigned rides
        if (role === "driver") {
            const result = await pool.query(`
                SELECT
                  r.id,
                  r.ride_code,
                  r.pickup_location,
                  r.destination,
                  r.status,
                  r.requested_at,
                  r.driver_id
                FROM rides r
                JOIN drivers d ON r.driver_id = d.id
                WHERE d.user_id = $1
                ORDER BY r.requested_at DESC
            `, [userId]);

            return res.json(result.rows);
        }

        return res.status(403).json({ message: "Forbidden" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}



// assign driver
exports.assignDriverToRide = async (req, res) => {
    try {
        const { id } = req.params;
        const { driver_id } = req.body;

        if (!driver_id) {
            return res.status(400).json({
                error: "driver_id is required"
            });
        }

        const driverCheck = await pool.query(
            `SELECT is_online FROM drivers WHERE id = $1`,
            [driver_id]
        );

        if (driverCheck.rows.length === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }

        if (!driverCheck.rows[0].is_online) {
            return res.status(409).json({
                error: "Cannot assign ride to offline driver"
            });
        }

        const result = await pool.query(
            `
            UPDATE rides
            SET driver_id = $1, status = 'assigned'
            WHERE id = $2 AND status = 'requested'
            RETURNING *
            `,
            [driver_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                error: "Ride not found or not in requested state"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//start ride:
exports.startRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(`
            UPDATE rides r
            SET status = 'in_progress'
            FROM drivers d
            WHERE r.id = $1
              AND r.status = 'assigned'
              AND r.driver_id = d.id
              AND d.user_id = $2
            RETURNING r.*
        `, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "Ride not assigned to this driver or invalid state"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


//complete ride (STATUS MUST BE IN PROGRESS)
exports.completeRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(`
            UPDATE rides r
            SET status = 'completed'
            FROM drivers d
            WHERE r.id = $1
              AND r.status = 'in_progress'
              AND r.driver_id = d.id
              AND d.user_id = $2
            RETURNING r.*
        `, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "Ride not assigned to this driver or invalid state"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
// GET /api/rides/my/history
exports.getMyRideHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            ` SELECT
                r.id,
                r.ride_code,
                r.pickup_location,
                r.destination,
                r.status,
                r.requested_at
            FROM rides r
            JOIN drivers d ON r.driver_id = d.id
            WHERE d.user_id = $1
            ORDER BY r.requested_at DESC
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}


