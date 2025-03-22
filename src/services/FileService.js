const File = require("../models/File");
const User = require("../models/User");



const uploadFileToCloudinary = (file, folder = 'Database Management System') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder },
            (error, cloudFile) => {
                if (error) reject(error);
                else resolve(cloudFile);
            }
        ).end(file.buffer);
    });
};

const createFileRecord = async (userId, file, fileType, folder, cloudinaryResult) => {
    console.log(folder)
    const newFile = new File({
        userId,
        fileName: file.originalname,
        fileType,
        fileSize: file.size,
        fileUrl: cloudinaryResult.secure_url,
        folderId: folder ? folder : null
    });

    return await newFile.save();
};

const updateUserStorageInfo = async (userId, fileType, fileSize) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.usedStorage += fileSize;
    user.storageUsage[fileType].count += 1;
    user.storageUsage[fileType].size += fileSize;

    // If the total storage exceeds the limit, throw an error
    if (user.usedStorage > user.totalStorage) {
        throw new Error('Storage limit exceeded');
    }

    return await user.save();
};

const createFolderService = async (userId, folderName) => {
    if (!userId || !folderName) {
        throw new Error("User ID and Folder Name are required");
    }

    const newFolder = new Folder({ userId, folderName });
    return await newFolder.save();
};


const moveFileToFolder = async (fileId, folderId) => {
    if (!fileId || !folderId) {
        throw new Error("File ID and Folder ID are required");
    }

    const file = await File.findById(fileId);
    if (!file) {
        throw new Error("File not found");
    }

    file.folderId = folderId;
    return await file.save();
};

const toggleFavorite = async (fileId) => {
    try {
        // Find the file by ID
        const file = await File.findById(fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // Toggle the isFavorite status
        file.isFavorite = !file.isFavorite;

        // Save the updated file
        await file.save();

        return file;
    } catch (error) {
        throw new Error("Error updating favorite status: " + error.message);
    }
};

const copyFileService = async (fileId, newFolderId) => {
    try {
        const file = await File.findById(fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // Create a new file entry with the same details but in a new folder
        const copiedFile = new File({
            userId: file.userId,
            folderId: newFolderId || null, // Place it in the new folder
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            fileUrl: file.fileUrl, // Same file URL
            isFavorite: file.isFavorite
        });

        return await copiedFile.save();
    } catch (error) {
        throw new Error("Error copying file: " + error.message);
    }
};

const duplicateFileService = async (fileId) => {
    try {
        const file = await File.findById(fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // Create a completely new file with a new ID
        const duplicatedFile = new File({
            userId: file.userId,
            folderId: file.folderId, // Keep it in the same folder
            fileName: `Copy of ${file.fileName}`,
            fileType: file.fileType,
            fileSize: file.fileSize,
            fileUrl: file.fileUrl, // Same file content
            isFavorite: file.isFavorite
        });

        return await duplicatedFile.save();
    } catch (error) {
        throw new Error("Error duplicating file: " + error.message);
    }
};


module.exports = {
    uploadFileToCloudinary,
    createFileRecord,
    updateUserStorageInfo,
    createFolderService,
    moveFileToFolder,
    toggleFavorite,
    copyFileService,
    duplicateFileService
};