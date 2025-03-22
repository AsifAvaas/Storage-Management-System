const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecureFolder = require("../models/SecureFolder");


const securityKey = process.env.SECURE_SECRET


const createSecureFolder = async (userId, folderName, password) => {
    const existingFolder = await SecureFolder.findOne({ userId, folderName });
    if (existingFolder) {
        throw new Error("Folder name already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newFolder = new SecureFolder({ userId, folderName, password: hashedPassword });
    await newFolder.save();
    return { message: "Secure folder created successfully" };
};

// ✅ Access Secure Folder and Get Token
const accessSecureFolder = async (userId, folderName, password) => {
    const folder = await SecureFolder.findOne({ userId, folderName });
    if (!folder) {
        throw new Error("Secure folder not found");
    }

    const isMatch = await bcrypt.compare(password, folder.password);
    if (!isMatch) {
        throw new Error("Incorrect secure folder password");
    }

    const token = jwt.sign(
        { userId, folderId: folder._id, secureAccess: true },
        securityKey,
        { expiresIn: "30m" }
    );

    return { message: "Access granted", folder, token };
};


const getSecureFolder = async (folderId) => {
    const folder = await SecureFolder.findById(folderId);
    if (!folder) {
        throw new Error("Secure folder not found");
    }
    return folder;
};

module.exports = { createSecureFolder, accessSecureFolder, getSecureFolder };
