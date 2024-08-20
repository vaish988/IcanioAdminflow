const express = require('express');
const router = express.Router();
const { createProgress, getAllProgress, getProgressById, updateProgress, deleteProgress } = require('../controllers/progresscontroller');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');
const User = require('../models/usermodel');

// Create a new progress (Admin only)
router.post('/', verifyToken, isAdmin, createProgress);

// Get all progress records
router.get('/', verifyToken, getAllProgress);

// Get a specific progress record by ID
router.get('/:id', verifyToken, getProgressById);

// Update a progress record (Admin only)
router.put('/:id', verifyToken, isAdmin, updateProgress);

// Delete a progress record (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteProgress);

module.exports = router;
