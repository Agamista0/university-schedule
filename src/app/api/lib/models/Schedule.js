import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    department : { 
        type: String, 
        enum: ['BA', 'IT'],
        required: true,
    },
    day: { 
        type: String, 
        required: true,
        index: true
    },
    time: { 
        type: String, 
        required: true 
    },
    lecture: { 
        type: String, 
        required: true 
    },
    professor: { 
        type: String,
        required: true
    },
    groups: {
        type: Map,
        of: String,
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

scheduleSchema.index({ day: 1, time: 1 });

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

export default Schedule; 