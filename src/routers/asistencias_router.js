import { Router } from "express";
import { crearAsistenciaController, actualizarAsistenciaController, eliminarAsistenciaController, obtenerAsistenciasController, obtenerAsistenciasPorUserController, crearAsistenciaControllerEntrenador } from "../controllers/asistencias_controller.js"; 
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/asistencias/entrenador", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), crearAsistenciaControllerEntrenador);
router.post("/asistencias", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), crearAsistenciaController);

router.put("/asistencias/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), actualizarAsistenciaController);
router.delete("/asistencias/:id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), eliminarAsistenciaController);
router.get("/asistencias/buscar/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), obtenerAsistenciasPorUserController);
router.get("/asistencias", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), obtenerAsistenciasController)

export default router;