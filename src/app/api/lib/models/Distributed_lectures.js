import mongoose from 'mongoose';

const Distributed_lecturesSchema = new mongoose.Schema({
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
        required: true
    },
    groups: {
        type: Map,
        of: String,
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Distributed_lectures = mongoose.models.Distributed_lectures || mongoose.model('Distributed_lectures', Distributed_lecturesSchema);

export default Distributed_lectures; 