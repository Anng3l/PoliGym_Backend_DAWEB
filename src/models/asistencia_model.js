import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,  // Asegúrate de que este campo sea requerido
    ref: "User"
  },
  checkInTime: {
    type: Date,
    required: true,
  }
});

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
export default Asistencia;