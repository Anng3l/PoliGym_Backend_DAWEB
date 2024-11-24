import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import usuarios from "../models/users_model.js";

const getAllUsersController = async (req, res) => {
    try
    {
        const data = await usuarios.getAllUsersModel();
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
    
};

const getOneUserController = async (req, res) => {
    const { id } = req.params;

    try
    {
        const data = await usuarios.getOneUserModel(id);    
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};


const createUserController = async (req, res) => {
    //Obtención de la data desde la petición
    const { password, ...userData } = req.body; //Params es para cuando los datos vienen en la ruta
    //Hasheo de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    //Construcción del objeto con los datos del usuario a crear
    const newUserData = {
        password: hashedPassword,
        ...userData
    };

    //Llamada al modelo
    try
    {
        const data = usuarios.createUserModel(newUserData);
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};



const updateUserController = async (req, res) => {
    //Obtención de los datos a pasar a la llamada al modelo
    const { id } = req.params;

    //Llamada al modelo con manejo de error
    try
    {
        const data = await usuarios.updateUserModel(id, req.body);

        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
};

const deleteOneUserController = async (req, res) => {
    const { id } = req.params;

    try
    {
        const data = await usuarios.deleteOneUserModel(id);
        res.status(200).json(data);
    }
    catch (error)
    {
        res.status(500).json(error);
    }
}

export {
    getAllUsersController,
    getOneUserController,
    createUserController,
    updateUserController,
    deleteOneUserController
}