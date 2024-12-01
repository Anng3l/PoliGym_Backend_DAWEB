import Asistencia from "../models/asistencia_model.js";

// Función para crear una nueva asistencia
export const crearAsistencia = async (req, res) => {
  try {
    const { userId, date, status, checkInTime, checkOutTime } = req.body;

    // Crear una nueva instancia del modelo de Asistencia
    const nuevaAsistencia = new Asistencia({
      userId,
      date,
      status,
      checkInTime,
      checkOutTime,
    });

    // Guardar la asistencia en la base de datos
    const asistenciaGuardada = await nuevaAsistencia.save();

    res.status(201).json({
      message: "Asistencia creada exitosamente",
      data: asistenciaGuardada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la asistencia", error });
  }
};

// Obtener todas las asistencias
export const obtenerAsistencias = async (req, res) => {
    try {
        const asistencias = await Asistencia.find();
        res.status(200).json({ message: "Asistencias obtenidas exitosamente", data: asistencias });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener asistencias", error });
    }
};

//Actualizar Asistencia
export const actualizarAsistencia = async (req, res) => {
    try {
      const { id } = req.params;  // Obtener el ID de los parámetros de la URL
      const { userId, date, status, checkInTime, checkOutTime } = req.body;  // Obtener los nuevos datos del cuerpo
  
      // Buscar la asistencia por ID y actualizarla
      const asistenciaActualizada = await Asistencia.findByIdAndUpdate(
        id,
        { userId, date, status, checkInTime, checkOutTime },
        { new: true }  // Esto devuelve el documento actualizado
      );
  
      // Si no se encuentra la asistencia
      if (!asistenciaActualizada) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
  
      // Responder con la asistencia actualizada
      res.json({
        message: "Asistencia actualizada exitosamente",
        data: asistenciaActualizada,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al actualizar la asistencia",
        error: error.message,
      });
    }
  };

export const eliminarAsistencia = async (req, res) => {
    const { id } = req.params;  // Obtener el ID de la URL

    try {
        // Buscar y eliminar la asistencia por ID
        const asistenciaEliminada = await Asistencia.findByIdAndDelete(id);
        
        if (!asistenciaEliminada) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        res.status(200).json({
            message: "Asistencia eliminada exitosamente",
            data: asistenciaEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al eliminar la asistencia",
            error: error.message
        });
    }
};