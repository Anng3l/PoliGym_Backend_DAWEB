import { Router } from "express";
import { crearAsistenciaController, actualizarAsistenciaController, eliminarAsistenciaController, obtenerAsistenciasController, obtenerAsistenciasPorUserController } from "../controllers/asistencias_controller.js"; 
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/asistencias", verifyToken, authorizedRoles("entrenador", "cliente"), crearAsistenciaController);
router.put("/asistencias/:id", verifyToken, authorizedRoles("entrenador"), actualizarAsistenciaController);
router.delete("/asistencias/:id", verifyToken, authorizedRoles("entrenador"), eliminarAsistenciaController);
router.get("/asistencias/buscar/:username", verifyToken, authorizedRoles("entrenador"), obtenerAsistenciasPorUserController);
router.get("/asistencias", verifyToken, authorizedRoles("entrenador", "cliente"), obtenerAsistenciasController)

export default router;