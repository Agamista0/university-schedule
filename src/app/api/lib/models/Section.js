import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
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
    },
    groups: {
        type: Object,
        required: true
    },
    hall: {
        type: String,
        required: true
    },
    center: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    department: {
        type: String,
        required: true ,
        default: 'IT'
    }
}, {
    timestamps: true
});

const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);

export default Section; 