import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  userId: {
    type: String,  // Usamos String si quieres un ID de usuario como string
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  }
});

// Creamos el modelo de Asistencia
const Asistencia = mongoose.model("Asistencia", asistenciaSchema);

export default Asistencia;
