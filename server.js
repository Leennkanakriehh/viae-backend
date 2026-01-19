const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening...")
});

app.use(cors());

app.get('/hi', (req, res) => {
    res.send("well well sell")
});

app.use((req, res) => "not found");