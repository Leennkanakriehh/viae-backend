function driverAuth(req, res, next) {
    const role = req.headers["x-role"];
    const userId = req.headers["x-user-id"];

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (role !== "driver") {
        return res.status(403).json({ message: "Driver access only" });
    }

    req.user = {
        id: Number(userId),
        role
    };

    next();
}

module.exports = driverAuth;
