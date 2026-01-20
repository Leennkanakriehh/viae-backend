const pool = require("../db");

// CREATE 
exports.createVehicle = async (req, res) => {
    try {
        const { driver_id, model, plate_number, color } = req.body;

        //check driver exist 
        const driverCheck = await pool.query(
            "SELECT id FROM drivers WHERE id = $1",
            [driver_id]
        );

        if (driverCheck.rows.length === 0) {
            return res.status(404).json({ error: "Driver does not exist" });
        }

        // check driver already has a vehicle
        const vehicleCheck = await pool.query(
            "SELECT id FROM vehicles WHERE driver_id = $1",
            [driver_id]
        );

        if (vehicleCheck.rows.length > 0) {
            return res.status(409).json({
                error: "This driver already has a vehicle"
            });
        }

        // plate number uniqueness
        const plateCheck = await pool.query(
            "SELECT id FROM vehicles WHERE plate_number = $1",
            [plate_number]
        );

        if (plateCheck.rows.length > 0) {
            return res.status(409).json({
                error: "Plate number already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO vehicles (driver_id, model, plate_number, color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [driver_id, model, plate_number, color]
        );

        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create vehicle" });
    }
}

//get all 
exports.getVehicles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch vehicles" });
    }
}

//get by id 
exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);

        if ((await result).rowCount === 0) {
            return res.json({ error: "Vehicle not found" });
        }

        return res.json((await result).rows[0]);
    } catch {
        console.error(err);
        return res.json({ error: "Failed to fetch vehicle" });
    }
}

//get vehicles by driver id
exports.getVehicleByDriver = async (req, res) => {
    try {
        const { driver_id } = req.params;

        const result = pool.query("SELECT * FROM vehicles WHERE driver_id = $1", [driver_id]);

        if ((await result).rows === 0) {
            return res.status(404).json({ error: "No vehicle found for this driver" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete vehicle" });
    }
}

// update 
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { model, plate_number, color } = req.body;

        //  chech vehicle exists
        const existing = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // check plate uniqueness 
        if (plate_number) {
            const plateCheck = await pool.query(
                "SELECT id FROM vehicles WHERE plate_number = $1 AND id != $2", [plate_number, id]);

            if (plateCheck.rows.length > 0) {
                return res.status(409).json({ error: "Plate number already exists" });
            }
        }

        // update vehicle
        const result = await pool.query(
            `UPDATE vehicles
       SET model = COALESCE($1, model),
           plate_number = COALESCE($2, plate_number),
           color = COALESCE($3, color)
       WHERE id = $4
       RETURNING *`,
            [model, plate_number, color, id]
        );

        return res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update vehicle" });
    }
}

// delete 
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM vehicles WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        return res.status(200).json({ message: "vehicle deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete vehicle" });
    }
};
