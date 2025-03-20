const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const OTP = require('../models/OTP');



const validateRegisterUser = [
    body("username").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
        })
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};


const createUser = async (req) => {

    try {
        let user = await User.findOne({ email: req.email })
        if (user) {
            const error = new Error("Email ID already exists");
            error.statusCode = 409
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const securepassword = await bcrypt.hash(req.password, salt)

        user = new User({
            username: req.username,
            email: req.email,
            password: securepassword
        })
        await user.save();
        return user;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const loginService = async (req) => {
    try {
        const { email, password } = req;
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404
            throw error
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401
            throw error
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        const refreshtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });


        return { user, token, refreshtoken };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteUserService = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const passwordForgotService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404
            throw error
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 15 * 60 * 1000;


        await OTP.create({ email, otp: otpCode, expiresAt: otpExpiry });


        const subject = "Password Reset Request";
        const text = `Your password reset token is: ${otpCode}. It will expire in 15 minutes.`;

        await sendMail(email, subject, text);

        return user


    } catch (error) {
        console.error(error);
        throw error;
    }
}
const verifyOTPService = async (email, otp) => {
    try {


        // Find the latest OTP for the email
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord || otpRecord.expiresAt < Date.now()) {
            const error = new Error("Invalid or expired OTP");
            error.statusCode = 400
            throw error

        }
        // OTP is valid, remove it from DB
        await OTP.deleteMany({ email });

        return otpRecord;

    } catch (error) {
        console.error(error);
        throw error;

    }
};

const resetPasswordService = async (email, newPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
    } catch (error) {
        console.error(error);
        throw error;

    }
}
module.exports = { validateRegisterUser, handleValidationErrors, createUser, loginService, deleteUserService, passwordForgotService, verifyOTPService, resetPasswordService }