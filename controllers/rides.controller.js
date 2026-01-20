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
        const result = await pool.query(`UPDATE rides SET driver_id = $1,
        status = 'assigned'
        WHERE id = $2
        AND status = 'requested'
        RETURNING *`, [driver_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                error: "Ride not found or not in requested state"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Driver does not exist"
            });
        }

        res.status(500).json({
            error: "Internal server error"
        });
    }
}
//start ride:
exports.startRide = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE rides SET status = 'in_progress' WHERE id = $1 AND status = 'assigned' RETURNING *`, [id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                error: "Ride not found or not in assigned state"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

//complete ride (STATUS MUST BE: IN PROGRESS)
exports.completeRide = async (req, res) => {
    try {
        const { id } = req.params; // ride id

        const result = await pool.query(
            `UPDATE rides SET status = 'completed' WHERE id = $1 AND status = 'in_progress' RETURNING *`, [id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                error: "Ride not found or not in progress"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

