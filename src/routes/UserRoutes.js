const express = require('express')
const router = express.Router()

const { registerUser, loginUser, logoutUser, deleteUser, forgotPassword, verifyOTP, resetPassword } = require('../controllers/UserController')
const { validateRegisterUser, handleValidationErrors } = require('../services/UserService')


router.post("/register", validateRegisterUser, handleValidationErrors, registerUser)
router.post("/login", loginUser)
router.post('/logout', logoutUser)
router.delete('/deleteAccout/:id', deleteUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)



module.exports = router