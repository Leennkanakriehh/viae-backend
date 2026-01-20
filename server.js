const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("listening...")
});


app.use((req, res) => "not found");