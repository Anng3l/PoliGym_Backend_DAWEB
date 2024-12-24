import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";

//import autenticacion from "../models/auth_model.js"
import { createToken, refreshToken } from "../middlewares/auth.js";
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
        const refreshJwt = await refreshToken({id: user.id, role: user.role});

        user.refreshToken = refreshJwt;
        await user.save();

        res.cookie("jwt", refreshJwt, { httpOnly: true, secure: true, maxAge: 86400000 });

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
        const token = nuevoUsuario.createToken();
        nodemailerMethods.sendMailToUser(email, token);

        let idx = uuidv4();
        nuevoUsuario.id = idx;

        //Se manda a la BD
        await nuevoUsuario.save();

        return res.status(201).json({msg: `Usuario ${nuevoUsuario.username} registrado`})
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

const verificacionDeRegistroController = async (req, res) => {
    try
    {
        const { token } = req.params;

        const clienteToken = await User.findOne({token});

        if (!token) return res.status(500).json({msg: "Token no enviado o inválido"});
        if (!clienteToken.token) return res.status(500).json({msg: "La cuenta ya ha sido confirmada"});

        clienteToken.token = null;
        clienteToken.confirmEmail = true;
        await clienteToken.save();
        return res.status(200).json({msg: "Registro confirmado satisfactoriamente"});
    }
    catch (error)
    {
        return res.status(500).json({error});
    }    
};

const refreshTokenController = async (req, res) => {
    //No hace falta desestructurar las cookies pues cookie-parser las convierte a objeto
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({msg: "Cookie o jwt no provisto en las cookies"});
    const refreshedJwt = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, secure: true, expires: new Date(0) });
    const userBD = await User.findOne({refreshToken: refreshedJwt});
    
    //Reutilización del Refresh JWT
    if (!userBD) {
        return res.status(403).json({msg: "No existe usuario asociado con el jwt de refresco"});
    }
    jwt.verify(
        refreshedJwt,
        process.env.REFRESH_JWT_SECRET,
        (error, decoded) => {
            if (error || userBD.id !== decoded.id) return res.status(401).json({msg: "Error en la verificación del JWT de refresco"});
            const token = jwt.sign(
                { id: decoded.id, role: decoded.role },
                process.env.REFRESH_JWT_SECRET,
                {expiresIn: "24h"}
            )
            userBD.refreshToken = token;
        }
        
    );
    await userBD.save();
    res.cookie("jwt", userBD.refreshToken, { httpOnly: true, secure: true, maxAge: 86400000 });
    return res.status(200).json({msg: userBD.refreshToken});
}

const logOutController = async (req, res) => {
    //En el frontend también se debe eliminar el jwt
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(204).json({msg: "Cookie o jwt no enviado"});
    const refreshJwt = cookies.jwt;
    const userBD = User.findOne({refreshToken: refreshJwt});
    if (!userBD) 
    {
        res.clearCookie("jwt", { httpOnly: true, secure: true, expires: new Date(0) });
        return res.status(204).json({msg: "No existe usuario con dicho jwt de refresco"});
    }
    
    userBD.refreshJwt = "";
    await userBD.save();
    res.clearCookie("jwt", { httpOnly: true, secure: true, expires: new Date(0) });
    return res.status(204).json({msg: `JWT de refresco eliminado exitosamente del usuario ${userBD.username}`});
};

export {
    logInController,
    registerController,
    verificacionDeRegistroController,
    refreshTokenController,
    logOutController
}