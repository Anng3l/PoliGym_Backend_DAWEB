import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,  // Asegúrate de que este campo sea requerido
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  checkOutTime: {
    type: Date,
    required: true,
  },
});

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
export default Asistencia;