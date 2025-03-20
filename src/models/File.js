const mongoose = require('mongoose')


// File Schema
const FileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ["image", "pdf", "note"], required: true },
    fileSize: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("File", FileSchema);
