import { Router } from "express";

const router = Router();

router.get("/", (req, res) =>{
    res.send("Raíz de Autenticación");
})

//router.put("/login", "");
//router.put("/register", "");

//router.put("/recovery", "");

export default router;