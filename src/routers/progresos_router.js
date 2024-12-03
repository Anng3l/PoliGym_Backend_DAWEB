import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, getAllProgressesController, getOneProgressController, updateOneProgressController } from "../controllers/progress_controller.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";


const router = Router();

router.post("/", verifyToken, authorizedRoles("cliente"), createOneProgressController);
  
router.get("/", verifyToken, authorizedRoles("cliente"), getAllProgressesController);
  
router.get("/:username", verifyToken, authorizedRoles("entrenador"), getOneProgressController);
  
router.put("/:id", verifyToken, authorizedRoles("cliente"), updateOneProgressController);
  
router.delete("/:id", verifyToken, authorizedRoles("cliente"), deleteOneProgressController);

export default router;