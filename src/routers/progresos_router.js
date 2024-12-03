import { Router } from "express";
import { createOneProgressController, deleteOneProgressController, getAllProgressesController, getOneProgressController, updateOneProgressController } from "../controllers/progress_controller.js";


const router = Router();

router.post("/", createOneProgressController);
  
router.get("/", getAllProgressesController);
  
router.get("/:username", getOneProgressController);
  
router.put("/:id", updateOneProgressController);
  
router.delete("/:id", deleteOneProgressController);

export default router;