import mongoose from "mongoose";
import Asistencia from "../models/asistencia_model.js";
import { check, validationResult } from "express-validator";

// Funcion Cerar Asistencia
export const crearAsistenciaController = async (req, res) => {
  try {
    const { idUser } = req.body;

    if (Object.values(req.body.idUser).includes("")) return res.status(203).json({msg: "Debe enviar valores en todos los campos"});
    
    if (!mongoose.isValidObjectId(idUser)) return res.status(203).json({msg: "Id de usuario incorrecta"});
    const idObject = new mongoose.Types.ObjectId(idUser);

    await check("checkInTime")
          .exists().withMessage("La fehcha de ingreso es obligatoria")
          .isISO8601().withMessage("Debe ser una fecha (yyyy-mm-dd'T'hh:mm:ssZ)")
          .toDate()
          .run(req);
          
    await check("checkOutTime")
          .exists().withMessage("La fecha de salida es obligatoria")
          .isISO8601().withMessage("Debe ser una fecha (yyyy-mm-dd'T'hh:mm:ssZ)")
          .toDate()
          .run(req);

    const errores = validationResult(req);

    if (!errores.isEmpty())
    {
      return res.status(400).json({
        msg: 'Errores de validación',
        errores: errores.array()
      });
    }
    
    if (!idUser) {
      return res.status(400).json({ msg: "El id del usuario es requerido." });
    }

    const fechaEntrada = new Date(req.body.checkInTime);
    const fechaSalida = new Date(req.body.checkOutTime);

    if (fechaEntrada > fechaSalida) return res.status(203).json({ msg: "La fecha de entrada no puede ser posterior a la fecha de salida" });

    const nuevaAsistencia = new Asistencia({ ...req.body });

    const asistenciaGuardada = await nuevaAsistencia.save();
    if (!asistenciaGuardada) return res.status(203).json({ msg: "La asistencia no pudo ser guardada en la BD" })
    
    return res.status(201).json({
      message: "Asistencia creada exitosamente",
      data: asistenciaGuardada,
    });
  } 
  catch (error) {
    return res.status(500).json({
      succes: false,
      msg: "Error al intentar crear una asistencia",
      error: error.message
    });
  }
};

// Obtener todas las asistencias
export const obtenerAsistenciasController = async (req, res) => {
  try {
    const asistencias = await Asistencia.find();
    if (!asistencias) return res.status(203).json({ msg: "No existen asistencias guardadas" });

    return res.status(200).json({ asistencias });
  } 
  catch (error) {
    return res.status(500).json({
      succes: false,
      msg: "Error al intentar leer todas las asistencias",
      error: error.message
    });
  }
};

//Actualizar Asistencia
export const actualizarAsistenciaController = async (req, res) => {
  try {
    const { id } = req.params;

    delete req.body.idUser;
    delete req.body._id;
    delete req.body.__v;

    if (!mongoose.isValidObjectId(id)) return res.status(203).json({ msg: "Id inválida" });
    const idObject = new mongoose.Types.ObjectId(id);

    await check("checkInTime")
          .optional()
          .isISO8601().withMessage("Debe ser una fecha (yyyy-mm-dd'T'hh:mm:ssZ)")
          .toDate()
          .run(req);
        
    await check("checkOutTime")
          .optional()
          .isISO8601().withMessage("Debe ser una fecha (yyyy-mm-dd'T'hh:mm:ssZ)")
          .toDate()
          .run(req);

    const errores = validationResult(req);

    if (!errores.isEmpty())
    {
      return res.status(400).json({
        msg: 'Errores de validación',
        errores: errores.array()
      });
    };

    let conversion;
    const asistenciaComprobacion = await Asistencia.findOne({ _id: idObject });
    if (req.body.checkInTime && !req.body.checkOutTime)
    {
      conversion = req.body.checkInTime; 
      if (conversion >= asistenciaComprobacion.checkOutTime) return res.status(203).json({ msg: "La fecha de ingreso no puede ser mayor o igual que la fecha de salida" });
    }
    else if (!req.body.checkInTime && req.body.checkOutTime)
    {
      conversion = req.body.checkOutTime;
      if (conversion <= asistenciaComprobacion.checkInTime) return res.status(203).json({ msg: "La fecha de salida no puede ser menor o igual que la fecha de ingreso" });
    }
    else if (req.body.checkInTime && req.body.checkOutTime)
    {
      let x = new Date(req.body.checkInTime);
      let y = new Date(req.body.checkOutTime);
      if (x >= y) return res.status(203).json({ msg: "La fecha de ingreso no puede ser mayor o igual que la fecha de salida" });
    }

    const asistenciaActualizada = await Asistencia.findByIdAndUpdate(
      {_id: idObject},
      req.body,
      { new: true }
    );

    if (!asistenciaActualizada) return res.status(404).json({ msg: "No se pudo actualizar la asistencia" });

    return res.status(200).json({
      msg: "Asistencia actualizada exitosamente"
    });
  } 
  catch (error) {
    return res.status(500).json({
      succes: false,
      msg: "Error al intentar actualizar una asistencia",
      error: error.message
    });
  }
};

export const eliminarAsistenciaController = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) return res.status(203).json({ msg: "Id inválida" });
    const idObject = new mongoose.Types.ObjectId(id);

    const asistenciaEliminada = await Asistencia.findByIdAndDelete({_id: idObject});
  
    if (!asistenciaEliminada) return res.status(404).json({ message: "La asistencia no se pudo eliminar" });

    return res.status(200).json({
        message: "Asistencia eliminada exitosamente"
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      msg: "Error al intentar actualizar una asistencia",
      error: error.message
    });
  }
};


export const obtenerAsistenciasPorUserController = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) return res.satus(203).json({ msg: "Id inválido" });
    const idObject = new mongoose.Types.ObjectId(id);

    const asistencias = await Asistencia.find({ idUser: idObject });

    if (asistencias.length > 0) {
      return res.status(200).json({
        message: "Asistencias obtenidas exitosamente",
        asistencias
      });
    } else {
      return res.status(404).json({
        message: "No se encontraron asistencias para ese usuario"
      });
    }
  } 
  catch (error) {
    return res.status(500).json({
      succes: false,
      msg: "Error al intentar buscar asistencias por usuario",
      error: error.message
    });
  }
};