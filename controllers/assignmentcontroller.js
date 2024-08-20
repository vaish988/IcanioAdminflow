const Assignment = require('../models/assignment');
const CourseDetails = require('../models/coursedetail');
const User = require('../models/usermodel');

// Create a new assignment (Admin only)
const createAssignment = async (req, res) => {
    const { tasks, link, coursedetails } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Create the new assignment
        const { id } = req.params;
        
        const newAssignment = new Assignment({
            tasks,
            link,
            coursedetails,
        });

        const savedAssignment = await newAssignment.save();

        // Optionally, update the course detail to reference this assignment
        await CourseDetails.findByIdAndUpdate(coursedetails, { $set: { assignments: savedAssignment._id } });

        res.status(201).json({ message: 'Assignment created successfully', assignment: savedAssignment });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all assignments
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('coursedetails');
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an assignment (Admin only)
const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const { tasks, link, coursedetails } = req.body;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Update the assignment
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            { tasks, link, coursedetails },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an assignment (Admin only)
const deleteAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(id);

        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createAssignment, getAssignments, updateAssignment, deleteAssignment };
