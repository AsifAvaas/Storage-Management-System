const User = require("../models/User");
const { storageInfoService } = require("../services/StorageService");


const getStorageinfo = async (req, res) => {
    try {
        const email = req.headers.email;

        if (!email) return res.status(400).json({ message: "Email is required" });

        userStorage = await storageInfoService(email)
        res.status(200).json({ message: "Storage fetched successfully", userStorage });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
}




module.exports = {
    getStorageinfo
}