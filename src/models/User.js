const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    totalStorage: { type: Number, default: 15 * 1024 * 1024 * 1024 }, // 15GB in bytes
    usedStorage: { type: Number, default: 0 },
    storageUsage: {
        image: { count: { type: Number, default: 0 }, size: { type: Number, default: 0 } },
        pdf: { count: { type: Number, default: 0 }, size: { type: Number, default: 0 } },
        note: { count: { type: Number, default: 0 }, size: { type: Number, default: 0 } }
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)