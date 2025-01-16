import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
    const { fullName, userName, email, password, role = 'user' } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
            role, 
        });

        const savedUser = await user.save();

        res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            userName: savedUser.userName,
            email: savedUser.email,
            role: savedUser.role, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticate user & get token
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            role: user.role, 
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get user profile (protected route)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile (protected route)
export const updateUserProfile = async (req, res) => {
    const { fullName, userName, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            userName: updatedUser.userName,
            email: updatedUser.email,
            role: updatedUser.role, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
