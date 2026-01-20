const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const userRoutes = require("./routes/users.routes")
const driverRoutes = require("./routes/drivers.routes");
const vehicleRoutes = require("./routes/vehicles.routes")
const rideRoutes = require("./routes/rides.routes");
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin.routes")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes)
app.use("/api/rides", rideRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

