import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Raíz de las rutinas");
});



export default router;