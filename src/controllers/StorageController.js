const File = require("../models/File");
const User = require("../models/User");
const { storageInfoService, uploadFileToCloudinary, createFileRecord, updateUserStorageInfo, createFolderService, moveFileToFolder, getFilesByFolder, getFilesByDate, toggleFavorite, getFavorite, duplicateFileService, copyFileService } = require("../services/StorageService");


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

const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { folder, fileType, userId } = req.body;

        if (!file) return res.status(400).json({ message: "No file uploaded" });


        const validFileTypes = ['image', 'pdf', 'note'];
        if (!validFileTypes.includes(fileType)) {
            return res.status(400).json({ message: "Invalid file type" });
        }


        const cloudinaryResult = await uploadFileToCloudinary(file, folder);


        const newFile = await createFileRecord(userId, file, fileType, folder, cloudinaryResult);

        await updateUserStorageInfo(userId, fileType, file.size);


        const user = await User.findById(userId);
        res.status(200).json({
            message: "File uploaded successfully",
            file: newFile,
            storageInfo: {
                totalStorage: user.totalStorage,
                usedStorage: user.usedStorage,
                storageUsage: user.storageUsage
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};
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
            fileType: fileType
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


const createFolder = async (req, res) => {
    try {
        const { userId, folderName } = req.body;
        const folder = await createFolderService(userId, folderName);

        res.status(201).json({ message: "Folder created successfully", folder });
    } catch (error) {
        res.status(500).json({ message: "Folder creation failed", error: error.message });
    }
};



const moveFile = async (req, res) => {
    try {
        const { fileId, folderId } = req.body;
        const file = await moveFileToFolder(fileId, folderId);

        res.status(200).json({ message: "File moved successfully", file });
    } catch (error) {
        res.status(500).json({ message: "Failed to move file", error: error.message });
    }
};



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

const toggleFavoriteStatus = async (req, res) => {
    try {
        const { fileId } = req.params; // File ID from request parameters

        if (!fileId) {
            return res.status(400).json({ message: "File ID is required" });
        }

        // Call the service function to toggle favorite status
        const updatedFile = await toggleFavorite(fileId);

        res.status(200).json({
            message: "File favorite status updated successfully",
            file: updatedFile
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update favorite status", error: error.message });
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


const copyFile = async (req, res) => {
    try {
        const { fileId, newFolderId } = req.body;

        if (!fileId || !newFolderId) {
            return res.status(400).json({ message: "File ID and New Folder ID are required" });
        }

        const copiedFile = await copyFileService(fileId, newFolderId);

        res.status(201).json({
            message: "File copied successfully",
            file: copiedFile
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to copy file", error: error.message });
    }
};

const duplicateFile = async (req, res) => {
    try {
        const { fileId } = req.body;

        if (!fileId) {
            return res.status(400).json({ message: "File ID is required" });
        }

        const duplicatedFile = await duplicateFileService(fileId);

        res.status(201).json({
            message: "File duplicated successfully",
            file: duplicatedFile
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to duplicate file", error: error.message });
    }
};

module.exports = {
    getStorageinfo, uploadFile,
    getPdfsForUser, getNotesForUser, getImagesForUser,
    createFolder, moveFile, getFilesInFolder, getFilesByDateRange,
    toggleFavoriteStatus, getFavoriteFiles, duplicateFile, copyFile
}