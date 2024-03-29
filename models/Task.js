// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this task.'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
