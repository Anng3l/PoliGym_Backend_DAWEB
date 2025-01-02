import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, listarProgresosUsuarioController, updateOneProgressController } from "../controllers/progress_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/progresos", createOneProgressController);
  
router.get("/progresos/:username", listarProgresosUsuarioController);
  
router.put("/progresos/:_id", updateOneProgressController);
  
router.delete("/progresos/:_id", deleteOneProgressController);


/*
router.post("/progresos", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), createOneProgressController);
  
router.get("/progresos/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("entrenador", "cliente"), listarProgresosUsuarioController);
  
router.put("/progresos/:id", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), updateOneProgressController);
  
router.delete("/progresos/:id", accountVerificationMiddleware, verifyToken, authorizedRoles("cliente"), deleteOneProgressController);
*/
export default router;