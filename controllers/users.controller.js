const { message } = require("statuses");
const pool = require("../db");

//create user

exports.createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
            [email, password, role]
        );
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                error: "Email already exists"
            });
        }

        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// GET all users 
exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//get user by id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal server error"
        });
    }


}

//delete user by id

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            message: "user successfully deleted"
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//update user email 
exports.updateUserEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        const result = await pool.query(
            `
      UPDATE users
      SET email = $1
      WHERE id = $2
      RETURNING id, email, role
      `,
            [email, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}


