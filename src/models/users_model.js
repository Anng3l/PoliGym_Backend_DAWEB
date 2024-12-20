import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["administrador", "entrenador", "cliente"]
    },
    token: {
        type: String,
        required: false
    }
},
{
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;