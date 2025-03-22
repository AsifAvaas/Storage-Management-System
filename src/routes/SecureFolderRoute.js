const express = require('express');
const { createSecureFolder, accessSecureFolder, getSecureFolder } = require('../controllers/SecureFolderController');
const verifySecureAccess = require('../Middleware/verifySecureAccess');
const router = express.Router()



router.post("/create-secure-folder", createSecureFolder);
router.post("/access-secure-folder", accessSecureFolder);
router.get("/secure-folder", verifySecureAccess, getSecureFolder);








module.exports = router

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RiZTY4YWViNmZiOTgwM2I0OWU5ZWEiLCJmb2xkZXJJZCI6IjY3ZGVlNzI0MTQzM2U2MDc5NDM5YmNhMSIsInNlY3VyZUFjY2VzcyI6dHJ1ZSwiaWF0IjoxNzQyNjYxNDk1LCJleHAiOjE3NDI2NjMyOTV9.NOsGihmWfwOdZ9GB_9qJXUOrE7MakeUO8bqNm-M8Vzk