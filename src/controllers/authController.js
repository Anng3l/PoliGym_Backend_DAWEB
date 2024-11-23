import autenticacion from "../models/auth_model.js"

const logInController = async (req, res) => {
    const {email, password} = req.body;
    try {
        const peticion = await autenticacion.loginUser(email, password);
        const respuesta = await peticion.json();
    }
    catch (error) {
        res.status(500).json("Ha ocurrido un error");
    }
};

const registerController = async (req, res) => {
}