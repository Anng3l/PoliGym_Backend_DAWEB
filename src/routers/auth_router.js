import { Router } from "express";
import { logInController, logOutController, refreshTokenController, registerController, verificacionDeRegistroController } from "../controllers/auth_controller.js";


const router = Router();

//Rutas públicas
router.post("/auth/login", logInController);
router.post("/auth/register", registerController);
router.get("/auth/confirm/:token", verificacionDeRegistroController);
router.get("/auth/refresh", refreshTokenController);
router.get("/auth/logout", logOutController);

export default router;