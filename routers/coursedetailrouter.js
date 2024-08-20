const express = require('express');
const router = express.Router();
const {
    createCourseDetail,
    getAllCourseDetails,
    getCourseDetailById,
    updateCourseDetail,
    deleteCourseDetail
} = require('../controllers/coursedetailcontroller');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');
const User = require('../models/usermodel');

// Route to create a new course detail (Admin only)
router.post('/', verifyToken, isAdmin, createCourseDetail);

// Route to get all course details (Admin & Student)
router.get('/', verifyToken, getAllCourseDetails);

// Route to get a single course detail by ID (Admin & Student)
router.get('/:id', verifyToken, getCourseDetailById);

// Route to update a course detail (Admin only)
router.put('/:id', verifyToken, isAdmin, updateCourseDetail);

// Route to delete a course detail (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteCourseDetail);

module.exports = router;
