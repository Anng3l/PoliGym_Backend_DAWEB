import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary"

import User from "../models/auth_model.js";

const getAllUsersController = async (req, res) => {
    try
    {
        const data = await User.find();

        if (data)
        {
            res.status(200).json(data);
        }
        else
        {
            res.status(200).json({
                msg: "No hay usuarios registrados"
            });
        }
        
    }
    catch (error)
    {
        res.status(500).json({
            msg: error.msg
        });
    }
    
};

const getOneUserController = async (req, res) => {
    const { username } = req.params;

    try
    {
        const data = await User.findOne({username});
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};



const getUsersByRoleController = async (req, res) => {
    const { role } = req.params;

    try
    {
        const data = await User.find({role});
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};




const createUserController = async (req, res) => {
    try
    {
        //Obtención de la data desde la petición
        const { name, username, email, password, role } = req.body; //Params es para cuando los datos vienen en la ruta
        //Hasheo de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        //Construcción del objeto con los datos del usuario a crear
        const newUserData = await User.create({
            id: uuidv4(),
            name,
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUserData.save();
        return res.status(200).json({msg: "Usuario registrado correctamente"})
    }
    catch (error)
    {
        return res.status(500).json(error);
    }
};



const updateUserController = async (req, res) => {
    //Obtención de los datos a pasar a la llamada al modelo
    const { username} = req.params;
    const datos = req.body;

    if (req.files.imagen)
    {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, {folder: "Fotos_De_Perfil"});

            datos.photo = cloudinaryResponse.secure_url;
        }
        catch (error)
        {
            return res.status(500).json({
                msg: "Error al subir la foto",
                details: error.message
            })
        }
    }

    if (datos.password)
    {
        try
        {
            const newPassword = await bcrypt.hash(datos.password, 10);
            datos.password = newPassword;
        }
        catch (error)
        {
            return res.status(500).json({
                msg:"Error al actualziar los datos - password",
                details: error.message
            })
        }
        
    }
    //Llamada al modelo con manejo de error
    try
    {
        const data = await User.updateOne({username}, {$set:datos});

        if (data.matchedCount===0)
        {
            return res.status(404).json({msg: "Usuario no encontrado"});
        }

        res.status(200).json({msg:"Actualización realizada correctamente"});
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};


const deleteOneUserController = async (req, res) => {
    const { username } = req.params;

    try
    {
        const data = await User.findOneAndDelete({username});
        res.status(200).json({msg: `Usuario ${username} eliminado correctamente`});
    }
    catch (error)
    {
        res.status(500).json({
            msg: "Error al eliminar un usuario",
            details: error.message});
    }
}


export {
    getAllUsersController,
    getOneUserController,
    getUsersByRoleController,
    createUserController,
    updateUserController,
    deleteOneUserController
}