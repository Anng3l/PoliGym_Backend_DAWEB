import { Router } from "express";
import { createRoutine, getRoutinesByUsername, updateRoutine, deleteRoutine, createRoutineEntrenador, deleteRoutineEntrenador, getRoutinesByUsernameEntrenador, updateRoutineEntrenador } from "../controllers/routines_controller.js";

import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/rutinas/entrenador", verifyToken, accountVerificationMiddleware, authorizedRoles("entrenador"), createRoutineEntrenador)
router.post("/rutinas", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente"), createRoutine)

router.put("/rutinas/entrenador/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), updateRoutineEntrenador)
router.put("/rutinas/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), updateRoutine)

router.get("/rutinas/entrenador/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), getRoutinesByUsernameEntrenador)
router.get("/rutinas/:username", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), getRoutinesByUsername)

router.delete("/rutinas/entrenador/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), deleteRoutineEntrenador)
router.delete("/rutinas/:_id", verifyToken, accountVerificationMiddleware, authorizedRoles("cliente", "entrenador"), deleteRoutine)

export default router;