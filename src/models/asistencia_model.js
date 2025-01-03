import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,  // Asegúrate de que este campo sea requerido
  },
  date: {
    type: Date,
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