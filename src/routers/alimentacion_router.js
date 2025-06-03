import { Router } from "express";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

import { createAlimentacionController, updateAlimentacionController, getAllAlimentacionControllerEntrenador, getAllAlimentacionController, deleteAlimentacionController } from "../controllers/alimentacion_controller.js";

const router = Router();

router.post("/alimentacion", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), createAlimentacionController);
router.put("/alimentacion/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), updateAlimentacionController);
router.get("/alimentacion/buscar/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), getAllAlimentacionControllerEntrenador);


router.get("/alimentacion", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), getAllAlimentacionController);


router.delete("/alimentacion/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), deleteAlimentacionController);

export default router;