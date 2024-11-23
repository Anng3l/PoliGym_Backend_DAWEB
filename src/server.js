import express from "express";

//Routers
import routerUsers from "./routers/users_router.js";
import routerRutinas from "./routers/rutinas_router.js";
import routerProgresos from "./routers/progresos_router.js";
import routerAuth from "./routers/auth_router.js";
import routerAsistencias from "./routers/asistencias_router.js";


const app = express();

app.set("port", process.env.port || 3000);

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