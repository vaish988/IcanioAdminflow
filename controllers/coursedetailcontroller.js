const CourseDetails = require('../models/coursedetail');
const Course = require('../models/course');
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');

// Create a new course detail (Admin only)
const createCourseDetail = async (req, res) => {
    const { courseTitle, topics, assignments, course } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Create the new course detail
        const newCourseDetail = new CourseDetails({
            courseTitle,
            topics,
            assignments,
            course,
            user: req.user.id, // Link the course detail to the admin user
        });

        const savedCourseDetail = await newCourseDetail.save();

        // Optionally, update the course to reference this course detail
        await Course.findByIdAndUpdate(course, { $set: { courseDetails: savedCourseDetail._id } });

        res.status(201).json({ message: 'Course detail created successfully', courseDetail: savedCourseDetail });
    } catch (error) {
        console.error('Error creating course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all course details (Admin & Student)
const getAllCourseDetails = async (req, res) => {
    try {
        const courseDetails = await CourseDetails.find()
            .populate('assignments')
            .populate('course')
            .populate('user', 'email');

        res.status(200).json(courseDetails);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single course detail by ID (Admin & Student)
const getCourseDetailById = async (req, res) => {
    const { id } = req.params;

    try {
        const courseDetail = await CourseDetails.findById(id)
            .populate('assignments')
            .populate('course')
            .populate('user', 'email');

        if (!courseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json(courseDetail);
    } catch (error) {
        console.error('Error fetching course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a course detail (Admin only)
const updateCourseDetail = async (req, res) => {
    const { id } = req.params;
    const { courseTitle, topics, assignments, course } = req.body;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Update the course detail
        const updatedCourseDetail = await CourseDetails.findByIdAndUpdate(
            id,
            { courseTitle, topics, assignments, course },
            { new: true }
        );

        if (!updatedCourseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json({ message: 'Course detail updated successfully', courseDetail: updatedCourseDetail });
    } catch (error) {
        console.error('Error updating course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a course detail (Admin only)
const deleteCourseDetail = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Delete the course detail
        const deletedCourseDetail = await CourseDetails.findByIdAndDelete(id);

        if (!deletedCourseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json({ message: 'Course detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCourseDetail, getAllCourseDetails, getCourseDetailById, updateCourseDetail, deleteCourseDetail };
