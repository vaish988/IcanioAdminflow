const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

const isAdmin = async (req, res, next) => {
    try {
        // Fetch the user using the email from req.user
        const user = await User.findOne({ email: req.user.email });

        // Check if the user exists and if their role is 'admin'
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin role required for this action!" });
        }

        // Proceed to the next middleware if the user is an admin
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
const isUser = async (req, res, next) => {
    try {
        // Fetch the user using the email from req.user
        const user = await User.findOne({ email: req.user.email });

        // Check if the user exists and if their role is 'admin'
        if (!user || user.role !== 'user') {
            return res.status(403).json({ message: "User required for this action!" });
        }

        // Proceed to the next middleware if the user is an admin
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { verifyToken, isAdmin, isUser };
