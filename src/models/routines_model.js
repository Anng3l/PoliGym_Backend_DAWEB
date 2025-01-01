import mongoose, { mongo } from "mongoose";

// Esquema de Ejercicios
const exerciseSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  series: { type: Number, require: true },
  repetitions: { type: Number, require: true },
});

// Esquema de Rutinas
const routineSchema = new mongoose.Schema(
  {
    idUserRutina: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
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
