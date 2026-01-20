export default function driverAuth(req, res, next) {
    const role = req.headers["x-role"];

    if (role === "driver") {
        next();
    } else {
        res.status(403).json({ message: "Driver access only" });
    }
}
