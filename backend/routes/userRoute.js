import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/login', authUser); // User login

// Admin-Only Routes
router.post('/register',  registerUser); // Register user (admin only)
router.route('/').get(protect, isAdmin, getAllUsers); // Get all users (admin only)

// Protected Routes
router
    .route('/profile')
    .get(protect, getUserProfile) // Get user profile (authenticated users only)
    .put(protect, updateUserProfile); // Update user profile (authenticated users only)

export default router;
