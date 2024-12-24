import mongoose, { model, mongo } from "mongoose";
import bcrypt from "bcrypt";

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
    },
    confirmEmail: {
        type: Boolean,
        require: false,
        default: false
    },
    refreshToken: [String]
},
{
    timestamps: true
});

userSchema.methods.encryptPassword = async function(password) 
{
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(password, salt);
    return passwordEncrypt;
};

userSchema.methods.matchPassword = async function(password)
{
    const response = await bcrypt.compare(password, this.password);
    return response;
};

userSchema.methods.createToken = function() 
{
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado;
}

export default model("User", userSchema);