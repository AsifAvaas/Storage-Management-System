const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { createUser, loginService, deleteUserService, passwordForgotService, verifyOTPService, resetPasswordService } = require('../services/UserService');
const User = require('../models/User');


const registerUser = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({ success: true, message: "Signed up successfully", data: user });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { user, token, refreshtoken } = await loginService(req.body);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });
        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json({ success: true, message: "Logged in successfully", data: user });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('authtoken');
        res.clearCookie('refreshtoken');
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await deleteUserService(req.params.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
}

const forgotPassword = async (req, res) => {

    try {
        const forgot = await passwordForgotService(req.body.email)
        return res.status(200).json({ success: true, message: "Reset token sent to email" });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
}


const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        verifyOTPService(email, otp)


        return res.status(200).json({ success: true, message: "OTP verified" });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ success: false, message: "Server error" });
    }
};



const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const password = resetPasswordService(email, newPassword)


        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
const updateProfile = async (req, res) => {
    try {
        const { userId, username, profilePic } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!username && !profilePic) {
            return res.status(400).json({ message: "Provide at least one field to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { username, profilePic } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const id = req.headers['userid']
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found", user });
        }
        const { username, email, profilePic, createdAt } = user;
        res.status(200).json({ message: "Profile fetched successfully", data: { username, email, profilePic, createdAt } });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });

    }
}


const changePassword = async (req, res) => {
    try {

        const { userId, oldPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new passwords are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to change password", error: error.message });
    }
};


module.exports = { registerUser, loginUser, logoutUser, deleteUser, forgotPassword, verifyOTP, resetPassword, updateProfile, getProfile, changePassword }