const User = require("../models/User");
const { uploadFileToCloudinary, createFileRecord, updateUserStorageInfo, createFolderService, moveFileToFolder, toggleFavorite, copyFileService, duplicateFileService } = require("../services/FileService");




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
    uploadFile,
    createFolder,
    moveFile,
    toggleFavoriteStatus,
    copyFile,
    duplicateFile
};