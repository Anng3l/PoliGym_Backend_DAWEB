import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, getUsersByRoleController, updateUserController } from "../controllers/user_controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import app from "../server.js";
import { Router } from "express";

const router = Router();

//Rutas protegidas
router.get("/users/", verifyToken, authorizedRoles("administrador"), getAllUsersController);
router.get("/users/:username", verifyToken, authorizedRoles("administrador"), getOneUserController);
router.get("/users/role/:role", verifyToken, authorizedRoles("administrador"), getUsersByRoleController);
router.put("/users/:username", verifyToken, authorizedRoles("administrador"), updateUserController);
router.delete("/users/:username", verifyToken, authorizedRoles("administrador"), deleteOneUserController);
router.post("/users/", verifyToken, authorizedRoles("administrador"), createUserController);


export default router;