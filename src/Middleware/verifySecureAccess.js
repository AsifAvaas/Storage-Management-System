const jwt = require("jsonwebtoken");
const secretKey = process.env.SECURE_SECRET

const verifySecureAccess = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        if (!decoded.secureAccess) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        req.userId = decoded.userId;
        req.folderId = decoded.folderId;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifySecureAccess;
