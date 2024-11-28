const authorizedRoles = (...allowedRoles) => {
    return (req, res , next) => {
        try
        {
            if (!allowedRoles.includes(req.user.role))
            {
                return res.status(401).json({msg: "Usuario no autorizado"});
            }
            next();
        }
        catch(error)
        {
            return res.status(401).json({msg: "Error en Usuario Middleware"});
        }
    };
}

export {
    authorizedRoles
};