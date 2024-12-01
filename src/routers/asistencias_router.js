import { Router } from "express";
import { crearAsistencia, actualizarAsistencia, eliminarAsistencia, obtenerAsistencias } from "../controllers/asistencias_controller.js"; 

const router = Router();

// Ruta para crear una nueva asistencia
router.post("/", crearAsistencia);

// Ruta para actualizar una asistencia existente
router.put("/:id", actualizarAsistencia);

// Ruta para eliminar una asistencia
router.delete("/:id", eliminarAsistencia);

// Ruta para obetner asistencias
router.get("/",obtenerAsistencias)

export default router;