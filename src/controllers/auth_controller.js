import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";

//import autenticacion from "../models/auth_model.js"
import { createToken, refreshToken } from "../middlewares/auth.js";
import User from "../models/users_model.js";
import nodemailerMethods from "../config/nodemailer.js";

const logInController = async (req, res) => {
    const cookies = req.cookies;
    const {email, password} = req.body;

    try
    {
        //Verificar que no hayan campos vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({
            msg: "Todos los campos son obligatorios"
        })

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

        //Email de aviso a usuario
        nodemailerMethods.sendMailToUserLogin(email);

        //Generación de jwt de acceso y de refresco
        const token = await createToken({id: user.id, role: user.role});
        const refreshJwt = await refreshToken({id: user.id, role: user.role});

        //Control de login en caso de contar con cookie antigua en la petición. También para login en múltilples dispositivos.
        //Si no existen cookies o si jwt es undefined: true
        let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);
        if (cookies?.jwt)
        {
            const refreshJwt = cookies.jwt;
            const foundToken = await User.findOne({refreshToken: refreshJwt});
            if (!foundToken)
            {
                newRefreshTokenArray = [];
            }
            res.clearCookie("jwt", { httpOnly: true, secure: true });
        }

        //Para autenticación en múltiples dispositivos
        user.refreshToken = [...newRefreshTokenArray, refreshJwt];
        await user.save();

        res.cookie("jwt", refreshJwt, { httpOnly: true, secure: true, maxAge: 86400000 });

        return res.status(200).json({token, role: user.role});
    }
    catch(error)
    {
        return res.status(500).json({
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
        return res.status(500).json({
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
        if (!token) return res.status(500).json({msg: "Token no enviado o inválido"});

        const clienteToken = await User.findOne({token});
        if (!clienteToken.token) return res.status(500).json({msg: "La cuenta ya ha sido confirmada"});

        clienteToken.token = null;
        clienteToken.confirmEmail = true;
        await clienteToken.save();
        return res.status(200).json({msg: "Registro confirmado satisfactoriamente"});
    }
    catch (error)
    {
        return res.status(500).json({
            succes: false,
            msg: "Error al intentar verificar registro",
            error: error.message
        });
    }    
};

const refreshTokenController = async (req, res) => {
    try
    {   
        //No hace falta destructurar las cookies pues cookie-parser las convierte a objeto
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.status(401).json({msg: "Cookie o jwt no provisto en las cookies"});
        const refreshedJwt = cookies.jwt;
        res.clearCookie("jwt", { httpOnly: true, secure: true});
        const userBD = await User.findOne({refreshToken: refreshedJwt});
        
        //Reutilización del Refresh JWT
        if (!userBD) {
            jwt.verify (
                refreshedJwt,
                process.env.REFRESH_JWT_SECRET,
                async (error, decoded) => {
                    //JWT inválido
                    if (error) return res.status(403).json({msg: "JWt inválido"});
                    //JWT válido y utilizado
                    let id = decoded.id;
                    let hackedUserBD = await User.findOne({id});
                    hackedUserBD.refreshToken = [];
                    await hackedUserBD.save();
                }
            )
            return res.status(403).json({msg: "No existe usuario asociado con el jwt de refresco"});
        }
        
        //Para la autenticación en múltiples dispositivos
        let newJwtArray = userBD.refreshToken.filter(rt => rt !== refreshedJwt);

        jwt.verify(
            refreshedJwt,
            process.env.REFRESH_JWT_SECRET,
            async (error, decoded) => {
                //JWT expirado o manipulado
                if (error || userBD.id !== decoded.id) return res.status(401).json({msg: "Error en la verificación del JWT de refresco"});

                //JWT aún es válido
                const accessJwt = jwt.sign(
                    { id: decoded.id, role: decoded.role },
                    process.env.JWT_SECRET,
                    {expiresIn: "15m"}
                );
                
                const token = jwt.sign(
                    { id: decoded.id, role: decoded.role },
                    process.env.REFRESH_JWT_SECRET,
                    {expiresIn: "24h"}
                );
                userBD.refreshToken = [...newJwtArray, token];
                await userBD.save();

                res.cookie("jwt", token, {httpOnly: true, secure: true, maxAge: 86400000});
                return res.status(200).json({accessJwt, role: decoded.role})
            }    
        );
    }
    catch(error) {
        return res.status(203).json({
            succes: false,
            msg: "Error en la generación de nuevo JWT",
            error: error.message
        });
    }
}

const logOutController = async (req, res) => {
    //En el frontend también se debe eliminar el jwt
    const cookies = req.cookies;

    try
    {
        if (!cookies?.jwt) return res.status(203).json({msg: "Cookie o jwt no enviado"});
        const refreshJwt = cookies.jwt;
        const userBD = await User.findOne({refreshToken: refreshJwt});

        //Reutilización de jwt de refresco
        if (!userBD) 
        {
            jwt.verify (
                refreshJwt,
                process.env.REFRESH_JWT_SECRET,
                async (error, decoded) => {
                    if (error) return res.status(500).json({msg: "Error en el JWT de refresco"});
                    let hackedUser = await User.findOne({id: decoded.id});
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            )
            res.clearCookie("jwt", { httpOnly: true, secure: true });
            return res.status(203).json({msg: "No existe usuario con dicho jwt de refresco"});
        }
        
        //Para autenticación en múltiples dispositivos
        userBD.refreshToken = userBD.refreshToken.find(rt => rt !== refreshJwt);
        await userBD.save();
        
        res.clearCookie("jwt", { httpOnly: true, secure: true });
        return res.status(200).json({msg: `JWT de refresco eliminado exitosamente del usuario ${userBD.username}`});
    }
    catch (error) {
        return res.status(500).json({
            succes: false,
            msg: "Error en el logout",
            error: error.message
        });
    }
};

const recoverPasswordMailingController = async (req, res) => {
    //Obtención de datos
    const { email } = req.body;

    try
    {
        //Verificaciones
        if (!email) return res.status(203).json({msg: "Correo no proporcionado"});
        const userBD = await User.findOne({email});
        if (!userBD) return res.status(404).json({msg: "No existe usuario con ese correo"});

        //Operaciones sobre la BD
        const token = userBD.createToken();
        userBD.token = token;
        nodemailerMethods.sendMailToUserRecovery(email, token);

        await userBD.save();
        return res.status(200).json({msg: "Revise su correo para restablecer su contraseña"});
    }
    catch (error)
    {
        return res.status(500).json({
            succes: false,
            msg: "Error al intentar recuperar contraseña",
            error: error.message
        });
    }
};

const confirmTokenController = async (req, res) => {
    //Obtención de datos
    const { token } = req.params;

    try 
    {
        //Verificaciones
        if (!token) return res.status(203).json({msg: "Token no proporcionado"});
        const userBD = await User.findOne({token});
        if (!userBD) return res.status(203).json({msg: "No existe usuario con ese token"});

        //Manejo de la BD
        userBD.recoverPassword = true;
        await userBD.save();

        res.cookie("token", token, {httpOnly: true, secure: true, maxAge: 86400000});
    
        return res.status(200).json({msg: "Su identidad ha sido verificada. Ya puede restablecer su contraseña."});
    }
    catch (error)
    {
        return res.status(500).json({
            succes: false,
            msg: "Error al intentar recuperar contraseña",
            error: error.message
        });
    }
};

const recoverPasswordController = async (req, res) => {
    const cookies = req.cookies;
    const {password, confirmPassword} = req.body;

    try
    {
        if (!cookies?.token) return res.status(203).json({msg: "No ha enviado el token para verificar identidad"});
        const userBD = await User.findOne({token: cookies.token});
        if (!userBD)
        {
            res.clearCookie("token", {httpOnly: true, secure: true});    
            return res.status(203).json({msg: "Token inválida"});
        } 
        if (!userBD.recoverPassword) return res.status(203).json({msg: "Error al recuperar la contraseña"})

        if (Object.values(req.body).includes("")) return res.status(203).json({msg: "Envíe todos los datos solicitados"});
        if (password !== confirmPassword) return res.status(203).json({msg: "Las contraseñas no son las mismas"});

        userBD.password = await userBD.encryptPassword(password);
        userBD.recoverPassword = false;
        userBD.token = null;
        await userBD.save();

        res.clearCookie("token", {httpOnly: true, secure: true});
        return res.status(200).json({msg: "Contraseña restablecida exitosamente"});
    }
    catch (error)
    {
        return res.status(500).json({
            succes: false,
            msg: "Error al intentar restablecer la contraseña",
            error: error.message
        });
    }
}

export {
    logInController,
    registerController,
    verificacionDeRegistroController,
    refreshTokenController,
    logOutController,
    recoverPasswordMailingController,
    confirmTokenController,
    recoverPasswordController
}