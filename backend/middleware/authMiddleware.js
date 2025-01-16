import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Attach user data to request
            req.user = {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
            };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        // Pass fullName and role to the frontend via req.user if needed
        next();
    } else {
        res.status(403).json({ message: 'Admin access only', role: req.user.role });
    }
};
