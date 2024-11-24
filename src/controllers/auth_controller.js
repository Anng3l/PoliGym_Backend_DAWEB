import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import autenticacion from "../models/auth_model.js"
import { createToken } from "../middlewares/auth.js";

const logInController = async (req, res) => {
    const {email, password} = req.body;
    try {
        const peticion = await autenticacion.loginUser(email, password);
        const token = await createToken(peticion);
        res.status(200).json({token});
    }
    catch (error) {
        res.status(500).json("Ha ocurrido un error");
    }
};

const registerController = async (req, res) => {
    //Separar entre contraseña y los demás datos
    const { password, ...usuario } = req.body;
    //Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    //Construir el json con los datos del usuario a registrar
    const userData = {
        id: uuidv4(),
        password: hashedPassword,
        ...usuario
    };

    try {
        const user = await autenticacion.registerUser(userData);
        res.status(200).json(user);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
}

export {
    logInController,
    registerController
}