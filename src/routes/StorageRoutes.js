const express = require('express')
const verifyToken = require('../Middleware/Authentication')
const { getStorageinfo, uploadFile, getPdfsForUser, getImagesForUser, getNotesForUser, createFolder, moveFile, getFilesInFolder, getFilesByDateRange, toggleFavoriteStatus, getFavoriteFiles, copyFile, duplicateFile } = require('../controllers/StorageController')
const upload = require('../utils/multer')
const router = express.Router()

router.get('/storage', verifyToken, getStorageinfo)
router.post('/upload', upload.single('file'), uploadFile);
router.get('/files/pdf/:userId', getPdfsForUser);
router.get('/files/note/:userId', getNotesForUser);
router.get('/files/image/:userId', getImagesForUser);
router.post("/create-folder", createFolder);
router.put("/move-file", moveFile);
router.get("/files/folder/:folderId", getFilesInFolder);
router.get("/files-by-date", getFilesByDateRange);
router.put("/toggle-favorite/:fileId", toggleFavoriteStatus);
router.get("/favorites/:userId", getFavoriteFiles);
router.post("/copy-file", copyFile);
router.post("/duplicate-file", duplicateFile);


module.exports = router