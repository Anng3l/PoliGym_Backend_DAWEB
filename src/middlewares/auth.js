import jwt from "jsonwebtoken";


const createToken = async (userInfo) => {
    return jwt.sign(userInfo, process.env.JWT_SECRET, {expiresIn: "2h"});
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({msg: "Token no enviado"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error)
        {
            return res.status(401).json({msg: "Fallo al autenticar"});
        }
        req.user = decoded;
        //console.log("En verifyToken: ", req.user)
        next();
    })
}

const refreshToken = async (userInfo) => {
    return jwt.sign(userInfo, process.env.REFRESH_JWT_SECRET, {expiresIn: "24h"});
};

export {
    createToken,
    verifyToken,
    refreshToken
}
