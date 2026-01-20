const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "0000",
    database: "viae_db",
});

pool.connect().then(() => console.log("connected"));

module.exports = pool;