import { Router } from "express";
import { createRoutine,getAllRoutines,getRoutineById,updateRoutine,deleteRoutine,} from "../controllers/routines_controller.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/rutinas", verifyToken, authorizedRoles("entrenador", "cliente"), getAllRoutines)

router.get("/rutinas/:id", verifyToken, authorizedRoles("entrenador", "cliente"), getRoutineById)

router.post("/rutinas", verifyToken, authorizedRoles("entrenador", "cliente"),createRoutine)

router.put("/rutinas/:id", verifyToken, authorizedRoles("entrenador", "cliente"),updateRoutine)

router.delete("/rutinas/:id", verifyToken, authorizedRoles("entrenador", "cliente"),deleteRoutine)





export default router;