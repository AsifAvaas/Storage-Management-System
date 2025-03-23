const cloudinary = require("../config/cloudinary");
const File = require("../models/File");
const Folder = require("../models/Folder");
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


const getFilesByFolder = async (folderId) => {
    try {
        return await File.find({ folderId });
    } catch (error) {
        throw new Error("Error fetching files: " + error.message);
    }
};

const getFilesByDate = async (date) => {
    try {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const files = await File.find({
            uploadedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        return files;
    } catch (error) {
        throw new Error("Error fetching files by date: " + error.message);
    }
};



const getFavorite = async (userId) => {
    try {
        const favoriteFiles = await File.find({ userId, isFavorite: true });
        return favoriteFiles;
    } catch (error) {
        throw new Error("Error fetching favorite files: " + error.message);
    }
};

const renameFile = async (fileId, newFileName) => {
    const file = await File.findById(fileId);
    if (!file) {
        throw new Error("File not found");
    }
    file.fileName = newFileName;
    await file.save();
    return file;
};
const deleteFile = async (fileId) => {
    const file = await File.findByIdAndDelete(fileId);
    if (!file) {
        throw new Error("File not found");
    }
    return file;
};



module.exports = {
    storageInfoService,
    getFilesByFolder,
    getFilesByDate,
    getFavorite,
    renameFile,
    deleteFile
}
