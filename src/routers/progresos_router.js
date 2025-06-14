import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, listarProgresosUsuarioController, listarProgresosUsuarioControllerEntrenador, updateOneProgressController } from "../controllers/progress_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/progresos", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), createOneProgressController);

router.get("/progresos/entrenador/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), listarProgresosUsuarioControllerEntrenador);
router.get("/progresos/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), listarProgresosUsuarioController);

router.put("/progresos/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), updateOneProgressController);
router.delete("/progresos/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), deleteOneProgressController);

export default router;