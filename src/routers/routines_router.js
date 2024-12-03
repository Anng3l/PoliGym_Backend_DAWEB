import { Router } from "express";
import { createRoutine,getAllRoutines,getRoutineById,updateRoutine,deleteRoutine,} from "../controllers/routines_controller.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/routines", verifyToken, authorizedRoles("entrenador", "cliente"), getAllRoutines)

router.get("/routines/:id", verifyToken, authorizedRoles("entrenador", "cliente"), getRoutineById)

router.post("/routines", verifyToken, authorizedRoles("entrenador", "cliente"),createRoutine)

router.put("/routines/:id", verifyToken, authorizedRoles("entrenador", "cliente"),updateRoutine)

router.delete("/routines/:id", verifyToken, authorizedRoles("entrenador", "cliente"),deleteRoutine)





export default router;