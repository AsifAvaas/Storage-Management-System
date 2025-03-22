const multer = require('multer');

// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {

        const allowedTypes = ['image/jpeg',
            'image/png',
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed"), false);
        }
    }
});

module.exports = upload;
