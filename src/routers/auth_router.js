import { Router } from "express";
import { logInController, registerController } from "../controllers/auth_controller.js";

const router = Router();

//Rutas públicas
router.post("/login", logInController);
router.post("/register", registerController);

//router.put("/recovery", "");

export default router;