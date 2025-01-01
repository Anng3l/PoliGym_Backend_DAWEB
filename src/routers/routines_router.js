import { Router } from "express";
import { createRoutine, getRoutinesByUsername, updateRoutine, deleteRoutine } from "../controllers/routines_controller.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/rutinas/:username", getRoutinesByUsername)

router.post("/rutinas", createRoutine)

router.put("/rutinas/:_id", updateRoutine)

router.delete("/rutinas/:_id", deleteRoutine)



//router.get("/rutinas/:username", verifyToken, authorizedRoles("entrenador", "cliente"), getRoutinesByUsername)

//router.post("/rutinas", verifyToken, authorizedRoles("entrenador", "cliente"),createRoutine)

//router.put("/rutinas/:id", verifyToken, authorizedRoles("entrenador", "cliente"),updateRoutine)

//router.delete("/rutinas/:id", verifyToken, authorizedRoles("entrenador", "cliente"),deleteRoutine)


export default router;