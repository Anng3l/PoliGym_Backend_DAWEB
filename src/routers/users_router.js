import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, updateUserController } from "../controllers/user_controller.js";
import { verifyToken } from "../middlewares/auth.js";
import app from "../server.js";
import { Router } from "express";

const router = Router();

//Rutas protegidas
router.get("/", verifyToken, getAllUsersController);
router.get("/:id", verifyToken, getOneUserController);
router.put("/:id", verifyToken, updateUserController);
router.delete("/:id", verifyToken, deleteOneUserController);
router.post("/", verifyToken, createUserController);


export default router;