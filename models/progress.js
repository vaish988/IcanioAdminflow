const mongoose = require('mongoose');
const Assignment = require('./assignment');

const progressSchema = new mongoose.Schema({
    progresses: [
        {
            progress: {
                type: Boolean,
                required: true // Ensure that 'progress' field is always provided
            }
        }
    ],
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true // Ensure that each progress is linked to an assignment
    }
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
