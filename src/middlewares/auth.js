import jwt from "jsonwebtoken";

const createToken = async (userInfo) => {
    return jwt.sign(userInfo, "secret_key", {expiresIn: "1h"});
};

const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
    {
        res.status(401).json({msg: "Token no enviado"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "secret_key", (error, decoded) => {
        if (error)
        {
            return res.status(401).json({msg: "Fallo al autenticar"});
        }
        req.user = decoded;
        next();
    })
}

export {
    createToken,
    verifyToken
}
