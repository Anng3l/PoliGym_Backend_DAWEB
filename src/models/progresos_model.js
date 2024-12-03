import mongoose from "mongoose";

const DetailSchema = new mongoose.Schema({
    weight: Number,
    muscle_mass: Number,
    fat_mass: Number,
    endurance: Number,
    distance_running: Number,
    time_running: Number,
    grip_strength: Number,
    jump_height: Number,
    max_speed: Number,
});

const ProgressSchema = new mongoose.Schema({
    id :
    {
        type: String,
        unique: true
    },
    username: String,
    routineId: String,
    date: Date,
    details: DetailSchema,
});

const Progress = mongoose.model("Progress", ProgressSchema);

export default Progress;