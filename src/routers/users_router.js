import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, updateUserController } from "../controllers/user_controller.js";
import app from "../server.js";
import { Router } from "express";

const router = Router();

//Sólo para usuario Administrador
router.get("/", getAllUsersController);
router.get("/:id", getOneUserController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteOneUserController);
router.post("/", createUserController);


export default router;