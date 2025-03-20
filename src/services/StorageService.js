const User = require("../models/User");


const storageInfoService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404
            throw error
        }
        const userStorage = {
            totalStorage: user.totalStorage,
            usedStorage: user.usedStorage,
            storageUsage: user.storageUsage,
        };
        return userStorage;

    } catch (error) {
        console.error(error);
        throw error;

    }
}




module.exports = { storageInfoService }