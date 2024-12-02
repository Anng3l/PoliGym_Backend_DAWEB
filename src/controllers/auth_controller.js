import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

//import autenticacion from "../models/auth_model.js"
import { createToken } from "../middlewares/auth.js";
import User from "../models/auth_model.js";

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

    /*
    try {
        const peticion = await autenticacion.loginUser(email, password);
        const token = await createToken(peticion);
        res.status(200).json({token});
    }
    catch (error) {
        res.status(500).json("Ha ocurrido un error");
    } */
};

const registerController = async (req, res) => {
    try
    {
        //Separar entre contraseña y los demás datos
        const { name, username, email, password, confirmPassword } = req.body;
            
            //Verificar contraseña
        let realPassword;
        const role = "cliente";
        if (confirmPassword === password)
        {
            realPassword = password;
        }
        else
        {
            return res.status(500).json({
                msg: "Contraseñas distintas"
            });
        };
            //Hashear contraseña
        const hashedPassword = await bcrypt.hash(realPassword, 10);


        //Construir el json con los datos del usuario a registrar
        const userData = await User.create({
            id: uuidv4(), name, username, email, password: hashedPassword, role
        });
        
        //Se manda a la BD
        const uploadToBD = await userData.save();

        res.status(201).json({msg: `Usuario ${userData.username} registrado`})
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