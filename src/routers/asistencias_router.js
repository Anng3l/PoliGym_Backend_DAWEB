import { Router } from "express";
import { crearAsistencia, actualizarAsistencia, eliminarAsistencia, obtenerAsistencias, obtenerAsistenciasPorUsername } from "../controllers/asistencias_controller.js"; 
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Ruta para crear una nueva asistencia
router.post("/asistencias/", verifyToken, authorizedRoles("entrenador", "cliente"), crearAsistencia);

// Ruta para actualizar una asistencia existente
router.put("/asistencias/:id", verifyToken, authorizedRoles("entrenador"), actualizarAsistencia);

// Ruta para eliminar una asistencia
router.delete("/asistencias/:id", verifyToken, authorizedRoles("entrenador"), eliminarAsistencia);

// Ruta para obtener asistencias de un usuario por username
router.get("/asistencias/buscar/:username", verifyToken, authorizedRoles("entrenador"), obtenerAsistenciasPorUsername);

router.get("/asistencias/", verifyToken, authorizedRoles("entrenador", "cliente"), obtenerAsistencias)

export default router;