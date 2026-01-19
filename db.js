const { Client } = require('pg');

const connection = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "0000",
    database: "viae_db"
})

connection.connect()
    .then(() => console.log("connected"))
    .catch(err => console.error(err))

module.exports = connection;