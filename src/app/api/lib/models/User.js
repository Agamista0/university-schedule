import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
