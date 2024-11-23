import { Router } from "express";

const router = Router();

router.get("/", (req, res)=> {
    res.send("Raíz de asistencias");
});



export default router;