import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseLevel: {
        type: Number,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true,
        enum: ['BA', 'IT'] 
    },
    centers: [{
        centerName: {
            type: String,
            required: true
        },
        numberOfStudents: {
            type: Number,
            required: true
        },
        numberOfGroups: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;