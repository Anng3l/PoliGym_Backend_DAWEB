import { Router } from "express";
import { createRoutine, getRoutinesByUsername, updateRoutine, deleteRoutine } from "../controllers/routines_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.get("/rutinas/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador", "cliente"), getRoutinesByUsername)

router.post("/rutinas", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador", "cliente"),createRoutine)

router.put("/rutinas/:id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador", "cliente"),updateRoutine)

router.delete("/rutinas/:id", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador", "cliente"),deleteRoutine)


export default router;