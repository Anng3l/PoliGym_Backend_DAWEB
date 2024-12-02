import { Router } from "express";
import { createRoutine,getAllRoutines,getRoutineById,updateRoutine,deleteRoutine,} from "../controllers/routines_controller.js";

const router = Router();

router.get("/routines", getAllRoutines)

router.get("/routines/:id", getRoutineById)

router.post("/routines",createRoutine)

router.put("/routines/:id",updateRoutine)

router.delete("/routines/:id",deleteRoutine)





export default router;