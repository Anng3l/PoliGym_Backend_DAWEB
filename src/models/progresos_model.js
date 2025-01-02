import mongoose from "mongoose";

const DetailSchema = new mongoose.Schema({
    name: { type: String },   //Quizá un enum
    measure: { type: Number }
});

const ProgressSchema = new mongoose.Schema({
    idUser : { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    dateStart: { type: Date},
    dateEnd: { type: Date },
    details: { type: [DetailSchema], require: false, default: [] }
},
{
    timestamps: true
});

const Progress = mongoose.model("Progress", ProgressSchema);

export default Progress;