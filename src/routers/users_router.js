import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, getUsersByRoleController, updateUserController } from "../controllers/user_controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import app from "../server.js";
import { Router } from "express";

const router = Router();

//Rutas protegidas
router.get("/", verifyToken, authorizedRoles("administrador", "entrenador"), getAllUsersController);
router.get("/:username", verifyToken, authorizedRoles("administrador", "entrenador"), getOneUserController);
router.get("/role/:role", verifyToken, authorizedRoles("administrador", "entrenador"), getUsersByRoleController);
router.put("/:username", verifyToken, authorizedRoles("administrador"), updateUserController);
router.delete("/:id", verifyToken, authorizedRoles("administrador"), deleteOneUserController);
router.post("/", verifyToken, authorizedRoles("administrador"), createUserController);


export default router;