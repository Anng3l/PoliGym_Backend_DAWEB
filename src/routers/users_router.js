import { createUserController, deleteOneUserController, getAllUsersController, getOneUserController, updateUserController } from "../controllers/user_controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorizedRoles } from "../middlewares/roleAuthMiddleware.js";
import app from "../server.js";
import { Router } from "express";

const router = Router();

//Rutas protegidas
router.get("/", verifyToken, authorizedRoles("admin", "entrenador"), (req, res) => {
    return res.status(200).json({msg: "asdasdasd"});
});
router.get("/:id", verifyToken, authorizedRoles("admin", "entrenador"), getOneUserController);
router.put("/:id", verifyToken, authorizedRoles("admin"), updateUserController);
router.delete("/:id", verifyToken, authorizedRoles("admin"), deleteOneUserController);
router.post("/", verifyToken, authorizedRoles("admin"), createUserController);


export default router;