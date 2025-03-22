const express = require('express')
const router = express.Router()

const { registerUser, loginUser, logoutUser, deleteUser, forgotPassword, verifyOTP, resetPassword, updateProfile, getProfile, changePassword } = require('../controllers/UserController')
const { validateRegisterUser, handleValidationErrors } = require('../services/UserService')
const verifyToken = require('../Middleware/Authentication')
const upload = require('../utils/multer')


router.post("/register", validateRegisterUser, handleValidationErrors, registerUser)
router.post("/login", loginUser)
router.post('/logout', logoutUser)
router.get('/profile', verifyToken, getProfile)
router.put("/update-profile", verifyToken, upload.single("profilePic"), updateProfile);
router.delete('/deleteAccout/:id', deleteUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)
router.put("/change-password", verifyToken, changePassword);

module.exports = router