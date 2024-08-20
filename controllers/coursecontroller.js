const Course = require('../models/course');
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const CourseDetails = require('../models/coursedetail');

// Create a new course (Admin only)
const createCourse = async (req, res) => {
    const { title, courseManager, managerMail, courseDetails } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Create the new course
        const newCourse = new Course({
            title,
            courseManager,
            managerMail,
            courseDetails,
            user: req.user.id,  // Link the course to the admin user
        });

        const savedCourse = await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all courses (Admin & Student)
const getCourses = async (req, res) => {
    try {
        // Fetch courses with populated details
        const courses = await Course.find()
            .populate('courseDetails')
            .populate('user');

        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a course (Admin only)
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, courseManager, managerMail, courseDetails } = req.body;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { title, courseManager, managerMail, courseDetails },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a course (Admin only)
const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Delete the course
        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all students and admins (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        const students = await Student.find({});
        const admins = await User.find({ role: 'admin' }); // Fetch only admins

        res.status(200).json({ students, admins });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse, getAllUsers };
