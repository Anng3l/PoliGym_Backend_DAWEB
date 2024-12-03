import { Router } from "express";
import { crearAsistencia, actualizarAsistencia, eliminarAsistencia, obtenerAsistencias, obtenerAsistenciasPorUsername } from "../controllers/asistencias_controller.js"; 

const router = Router();

// Ruta para crear una nueva asistencia
router.post("/", crearAsistencia);

// Ruta para actualizar una asistencia existente
router.put("/:id", actualizarAsistencia);

// Ruta para eliminar una asistencia
router.delete("/:id", eliminarAsistencia);

// Ruta para obtener asistencias de un usuario por username
router.get("/buscar/:username", obtenerAsistenciasPorUsername);

router.get("/",obtenerAsistencias)

export default router;