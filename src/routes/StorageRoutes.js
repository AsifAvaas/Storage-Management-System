const express = require('express')
const verifyToken = require('../Middleware/Authentication')
const { getStorageinfo } = require('../controllers/StorageController')
const router = express.Router()

router.get('/storage', verifyToken, getStorageinfo)



module.exports = router