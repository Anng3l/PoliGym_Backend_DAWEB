import app from "../server.js";
import { Router } from "express";

const router = Router();

router.get("/", (req, res)=> {
    res.send("Raíz de la ruta usuarios");
});

//Sólo para usuario Administrador
router.get("/")


export default router;