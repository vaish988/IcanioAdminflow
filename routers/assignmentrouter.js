const express = require('express');
const { createAssignment, getAssignments, updateAssignment, deleteAssignment } = require('../controllers/assignmentcontroller');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');
const User = require('../models/usermodel');


const router = express.Router();

// Create a new assignment (Admin only)
router.post('/:id', verifyToken, isAdmin, createAssignment);

// Get all assignments (Admin & Student)
router.get('/', verifyToken, getAssignments);

// Update an assignment (Admin only)
router.put('/:id', verifyToken, isAdmin, updateAssignment);

// Delete an assignment (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteAssignment);

module.exports = router;
