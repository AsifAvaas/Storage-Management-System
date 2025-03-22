const secureFolderService = require("../services/SecureFolderService");

const createSecureFolder = async (req, res) => {
    try {
        const { userId, folderName, password } = req.body;
        if (!userId || !folderName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await secureFolderService.createSecureFolder(userId, folderName, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const accessSecureFolder = async (req, res) => {
    try {
        const { userId, folderName, password } = req.body;
        if (!userId || !folderName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await secureFolderService.accessSecureFolder(userId, folderName, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const getSecureFolder = async (req, res) => {
    try {
        const { folderId } = req;
        const folder = await secureFolderService.getSecureFolder(folderId);
        res.json({ message: "Secure folder accessed", folder });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { createSecureFolder, accessSecureFolder, getSecureFolder };