import express from "express";

//Routers
import routerUsers from "./routers/users_router.js";
import routerRutinas from "./routers/routines_router.js";
import routerProgresos from "./routers/progresos_router.js";
import routerAuth from "./routers/auth_router.js";
import routerAsistencias from "./routers/asistencias_router.js";

import dotenv from "dotenv"
import dbConnect from "./config/dbConnect.js";
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";


//Inicia la conexión a la bd en MongoDB
dbConnect();
//Carga e inyecta las variables de entorno al objeto global process.env (objeto que contiene las vvariables de entorno disponibles en esta app)
dotenv.config();


const app = express();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads"
}));


const PORT = process.env.PORT || 7001;
app.set("port", PORT);

app.use(express.json());
    //Middleware para cookies
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server On");
})
app.use("/api", routerUsers);
app.use("/api", routerRutinas);
app.use("/api", routerProgresos);
app.use("/api", routerAuth);
app.use("/api", routerAsistencias);




export default app;