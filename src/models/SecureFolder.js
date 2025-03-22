const mongoose = require('mongoose')

const { Schema } = mongoose


const SecureFolderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderName: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});




module.exports = mongoose.model('SecureFolder', SecureFolderSchema)