import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    center: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LECTURE_HALL', 'LAB'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    possibilities: {
        type: String,
        default: null
    }
}
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room; 