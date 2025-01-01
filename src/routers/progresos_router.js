import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, getAllProgressesController, getOneProgressController, updateOneProgressController } from "../controllers/progress_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/progreso/", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), createOneProgressController);
  
router.get("/progreso/", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), getAllProgressesController);
  
router.get("/progreso/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador"), getOneProgressController);
  
router.put("/progreso/:id", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), updateOneProgressController);
  
router.delete("/progreso/:id", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), deleteOneProgressController);

export default router;