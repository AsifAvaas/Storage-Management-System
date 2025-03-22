const File = require("../models/File");
const User = require("../models/User");
const { storageInfoService, getFilesByFolder, getFilesByDate, getFavorite } = require("../services/StorageService");


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

const getFilesForUser = async (req, res, fileType) => {
    try {
        const { userId } = req.params; // Getting userId from URL params

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Query the File collection for all files of the given fileType belonging to the user
        const files = await File.find({
            userId: userId,
            fileType: fileType,
            folderId: null  // Assuming you want files that are not in any folder
        });

        // If no files are found
        if (files.length === 0) {
            return res.status(404).json({ message: `No ${fileType}s found for this user` });
        }

        // Respond with the files
        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `An error occurred while fetching ${fileType}s`, error: error.message });
    }
};
const getPdfsForUser = (req, res) => getFilesForUser(req, res, 'pdf');

const getNotesForUser = (req, res) => getFilesForUser(req, res, 'note');

// Function to get all images for a user
const getImagesForUser = (req, res) => getFilesForUser(req, res, 'image');







const getFilesInFolder = async (req, res) => {
    try {
        const { folderId } = req.params;

        // Validate input
        if (!folderId) {
            return res.status(400).json({ message: "Folder ID is required" });
        }

        // Fetch files using service
        const files = await getFilesByFolder(folderId);

        res.status(200).json({
            message: "Files retrieved successfully",
            files
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve files", error: error.message });
    }
};


const getFilesByDateRange = async (req, res) => {
    try {

        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        // Convert the date string to a Date object
        const parsedDate = new Date(date);

        // Check if the date is valid
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // Fetch files uploaded on the specified date
        const files = await getFilesByDate(parsedDate);

        // Respond with the list of files
        res.status(200).json({
            message: "Files fetched successfully",
            files
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch files", error: error.message });
    }
};


const getFavoriteFiles = async (req, res) => {
    try {
        const { userId } = req.params; // Extract user ID from request params

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Call service function to get favorite files
        const favoriteFiles = await getFavorite(userId);

        res.status(200).json({
            message: "Favorite files retrieved successfully",
            files: favoriteFiles
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch favorite files", error: error.message });
    }
};



module.exports = {
    getStorageinfo, getPdfsForUser,
    getNotesForUser, getImagesForUser,
    getFilesInFolder, getFilesByDateRange,
    getFavoriteFiles
}