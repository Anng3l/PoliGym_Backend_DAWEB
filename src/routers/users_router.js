import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, getUsersByRoleController, updateUserController } from "../controllers/user_controller.js";
import app from "../server.js";
import { Router } from "express";

import { verifyToken } from "../middlewares/auth.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import { accountVerificationMiddleware } from "../middlewares/accountVerification.js";

const router = Router();

router.post("/users", verifyToken, authorizedRoles("administrador"), createUserController);
router.put("/users/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("administrador"), updateUserController);
router.get("/users", accountVerificationMiddleware, verifyToken, authorizedRoles("administrador"), getAllUsersController);
router.get("/users/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("administrador"), getOneUserController);
router.get("/users/role/:role", accountVerificationMiddleware, verifyToken, authorizedRoles("administrador"), getUsersByRoleController);
router.delete("/users/:username", accountVerificationMiddleware, verifyToken, authorizedRoles("administrador"), deleteOneUserController);

export default router;