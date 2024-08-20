const Progress = require('../models/progress');
const Assignment = require('../models/assignment');
const User = require('../models/usermodel'); // Assuming your user model is named 'usermodel'

// Create a new progress (Admin only)
const createProgress = async (req, res) => {
    const { progresses, assignment } = req.body;
    const { id } = req.params;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Check if the assignment exists
        const existingAssignment = await Assignment.findById(assignment);
        if (!existingAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Create the new progress
        const newProgress = new Progress({
            progresses,
            assignment,
        });

        const savedProgress = await newProgress.save();

        res.status(201).json({ message: 'Progress created successfully', progress: savedProgress });
    } catch (error) {
        console.error('Error creating progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all progress records
const getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find().populate('assignment');
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific progress record by ID
const getProgressById = async (req, res) => {
    const { id } = req.params;

    try {
        const progress = await Progress.findById(id).populate('assignment');
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a progress record (Admin only)
const updateProgress = async (req, res) => {
    const { id } = req.params;
    const { progresses, assignment } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Update the progress record
        const updatedProgress = await Progress.findByIdAndUpdate(
            id,
            { progresses, assignment },
            { new: true }
        );

        if (!updatedProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.status(200).json({ message: 'Progress updated successfully', progress: updatedProgress });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a progress record (Admin only)
const deleteProgress = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Delete the progress record
        const deletedProgress = await Progress.findByIdAndDelete(id);

        if (!deletedProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error) {
        console.error('Error deleting progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProgress, getAllProgress, getProgressById, updateProgress, deleteProgress };
