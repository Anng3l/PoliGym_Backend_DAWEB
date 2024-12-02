import mongoose, { mongo } from "mongoose";


// Esquema de Ejercicios
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  series: { type: Number, required: true },
  repetitions: { type: Number, required: true },
});

// Esquema de Rutinas
const routineSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    coachId: { type: String, required: true, default:0},
    name: { type: String, required: true },
    description: { type: String, required: true },
    exercises: [exerciseSchema],
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

// Crear el modelo
const Routine = mongoose.model("Routine", routineSchema);

export default Routine;
