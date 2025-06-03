import mongoose from "mongoose";

const alimentacionSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    require: true
  },
  information: {
    type: String,
    required: true,
  }
});

const Alimentacion = mongoose.model('Alimentacion', alimentacionSchema);
export default Alimentacion;