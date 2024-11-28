import express from "express";

//Routers
import routerUsers from "./routers/users_router.js";
import routerRutinas from "./routers/rutinas_router.js";
import routerProgresos from "./routers/progresos_router.js";
import routerAuth from "./routers/auth_router.js";
import routerAsistencias from "./routers/asistencias_router.js";

import dotenv from "dotenv"
import dbConnect from "./config/dbConnect.js";

//Inicia la conexión a la bd en MongoDB
dbConnect();
//Carga e inyecta las variables de entorno al objeto global process.env (objeto que contiene las vvariables de entorno disponibles en esta app)
dotenv.config();

const app = express();

const PORT = process.env.PORT || 7001;

app.set("port", PORT);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server On");
})

app.use("/users", routerUsers);
app.use("/rutinas", routerRutinas);
app.use("/progresos", routerProgresos);
app.use("/auth", routerAuth);
app.use("/asistencia", routerAsistencias);




export default app;