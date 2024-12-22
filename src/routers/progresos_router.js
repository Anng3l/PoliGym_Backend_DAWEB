import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, getAllProgressesController, getOneProgressController, updateOneProgressController } from "../controllers/progress_controller.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";


const router = Router();

router.post("/progreso/", verifyToken, authorizedRoles("cliente"), createOneProgressController);
  
router.get("/progreso/", verifyToken, authorizedRoles("cliente"), getAllProgressesController);
  
router.get("/progreso/:username", verifyToken, authorizedRoles("entrenador"), getOneProgressController);
  
router.put("/progreso/:id", verifyToken, authorizedRoles("cliente"), updateOneProgressController);
  
router.delete("/progreso/:id", verifyToken, authorizedRoles("cliente"), deleteOneProgressController);

export default router;