import mongoose from "mongoose";
import User from "../models/users_model.js";

const accountVerificationMiddleware = async (req, res, next) => {
    const userId = req.user._id;
    
    if (!userId) return res.status(203).json({msg: "Id no enviada"});
    if (!mongoose.isValidObjectId(userId)) return res.status(203).json({msg: "_id inválida"});
    const idObject = new mongoose.Types.ObjectId(userId);
    const userBd = await User.findOne({ _id: idObject });

    if (!userBd) return res.status(203).json({msg: "Usuario no encontrado"})
    
    if (!userBd.confirmEmail) return res.status(203).json({msg: "Usuario sin confirmar correo electrónico"});
    if (userBd.recoverPassword) return res.status(203).json({msg: "Usuario recuperando contraseña"})
    
    next();
};

export {accountVerificationMiddleware};