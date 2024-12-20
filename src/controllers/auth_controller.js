import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

//import autenticacion from "../models/auth_model.js"
import { createToken } from "../middlewares/auth.js";
import User from "../models/auth_model.js";
import nodemailerMethods from "../config/nodemailer.js";

const logInController = async (req, res) => {
    const {email, password} = req.body;

    try
    {
        const user = await User.findOne({email});
        if (!user)
        {
            return res.status(404).json({ msg: `Credenciales incorrectas` });
        }

        const passWordMatch = await bcrypt.compare(password, user.password);

        if (!passWordMatch)
        {
            return res.status(404).json({ msg: "Credenciales incorrectas" });
        }

        nodemailerMethods.sendMailToUserLogin(email);
        const token = await createToken({id: user.id, role: user.role});

        res.status(200).json({token});
    }
    catch(error)
    {
        res.status(500).json({
            succes: false,
            msg: "Error al intentar iniciar sesión",
            error: error.message
        });
    }
};

const registerController = async (req, res) => {
    try
    {
        //Separar entre contraseña y los demás datos
        const {username, email, password, confirmPassword } = req.body;
            

            //Verificar que no hayan campos vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({
            msg: "Todos los campos son obligatorios"
        })
            //Verificar que el correo no haya sido utilizado anteriormente
        const correoUnico = await User.findOne({email});
        if (correoUnico) return res.status(400).json({
            msg: "Correo ya registrado"
        });

            //Verificar que el username no haya sido utilizado anteriormente
        const usernameExiste = await User.findOne({username});
        if (usernameExiste) return res.status(400).json({
            msg: "Username ya existente"})

            //Verificar contraseña
        if (confirmPassword !== password)
        {
            return res.status(500).json({
                msg: "Contraseñas distintas"
            });
        }
            
            //Construir el json con los datos del usuario a registrar
        const nuevoUsuario = new User(req.body);        
        nuevoUsuario.role = "cliente";
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

            //Crear token y enviar email
        const token = User.createToken();
        nodemailerMethods.sendMailToUser(email, token);


        //Se manda a la BD
        await userData.save();

        return res.status(201).json({msg: `Usuario ${userData.username} registrado`})
    }
    catch (error)
    {
        res.status(500).json({
            succes: false,
            msg: "Error al intentar registrarse",
            error: error.message
        });
    };
};

export {
    logInController,
    registerController
}