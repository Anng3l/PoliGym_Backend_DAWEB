import { Router } from "express";
import { createRoutine, getRoutinesByUsername, updateRoutine, deleteRoutine } from "../controllers/routines_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/rutinas", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"),createRoutine)
router.put("/rutinas/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"),updateRoutine)
router.get("/rutinas/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), getRoutinesByUsername)
router.delete("/rutinas/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"),deleteRoutine)

export default router;