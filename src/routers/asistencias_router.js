import { Router } from "express";
import { crearAsistenciaController, actualizarAsistenciaController, eliminarAsistenciaController, obtenerAsistenciasController, obtenerAsistenciasPorUserController } from "../controllers/asistencias_controller.js"; 
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/asistencias", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador", "cliente"), crearAsistenciaController);
router.put("/asistencias/:_id", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador"), actualizarAsistenciaController);
router.delete("/asistencias/:id", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador"), eliminarAsistenciaController);
router.get("/asistencias/buscar/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador"), obtenerAsistenciasPorUserController);
router.get("/asistencias", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), obtenerAsistenciasController)

export default router;