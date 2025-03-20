const mongoose = require('mongoose')
// Folder Schema

const FolderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderName: { type: String, required: true },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // For nested folders
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Folder", FolderSchema);
