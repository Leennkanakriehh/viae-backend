const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "viae_db",
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};