import Asistencia from "../models/asistencia_model.js";
import User from "../models/users_model.js";  // Importa el modelo sin redefinirlo

// // Función para crear una nueva asistencia asociada a un username
// export const crearAsistencia = async (req, res) => {
//   try {
//     const { username, date, status, checkInTime, checkOutTime } = req.body;

//     // Busca al usuario por su username
//     const usuario = await User.findOne({ username });

//     if (!usuario) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     // Crear una nueva instancia del modelo de Asistencia
//     const nuevaAsistencia = new Asistencia({
//       userId: usuario._id,  // Utiliza el _id del usuario encontrado
//       date,
//       status,
//       checkInTime,
//       checkOutTime
//     });

//     // Guardar la nueva asistencia
//     const savedAsistencia = await nuevaAsistencia.save();
//     res.status(201).json({ message: "Asistencia creada exitosamente", data: savedAsistencia });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al crear la asistencia", error });
//   }
// };


// Funcion Cerar Asistencia
export const crearAsistencia = async (req, res) => {
  try {
    const { userId, username, date, status, checkInTime, checkOutTime } = req.body;

    // Asegúrate de que username sea enviado en el cuerpo de la solicitud
    if (!username) {
      return res.status(400).json({ message: "El campo 'username' es requerido." });
    }

    // Crear una nueva instancia del modelo de Asistencia
    const nuevaAsistencia = new Asistencia({
      userId,
      username,  // Incluye username aquí
      date,
      status,
      checkInTime,
      checkOutTime,
    });

    // Guardar la asistencia en la base de datos
    const asistenciaGuardada = await nuevaAsistencia.save();

    // Responder con éxito
    res.status(201).json({
      message: "Asistencia creada exitosamente",
      data: asistenciaGuardada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear la asistencia",
      error: error,
    });
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


// Función para obtener asistencias por username
export const obtenerAsistenciasPorUsername = async (req, res) => {
  const { username } = req.params; // Obtener el username desde los parámetros de la URL

  try {
    // Buscamos las asistencias usando el username
    const asistencias = await Asistencia.find({ username });

    if (asistencias.length > 0) {
      // Si hay asistencias, devolvemos la respuesta
      res.status(200).json({
        message: "Asistencias obtenidas exitosamente",
        data: asistencias
      });
    } else {
      // Si no se encontraron asistencias para ese username
      res.status(404).json({
        message: "No se encontraron asistencias para el usuario"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener asistencias",
      error: error.message
    });
  }
};