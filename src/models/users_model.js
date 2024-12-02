import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["administrador", "entrenador", "cliente"]
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;

/*const usuarios = {

    //Obtención todos
    getAllUsersModel: async () => {
        const url = `http://localhost:4000/users`;

        const peticion = await fetch(url);
        
        const data = await peticion.json();

        return data;
    },

    //Obtención cédula
    getOneUserModel: async (cedula) => {
        const url = `http://localhost:4000/users/${cedula}`;

        const peticion = await fetch(url);

        const data = await peticion.json();

        return data;
    },


    //Creación de usuario
    async createUserModel(newUser) {
        const url = "http://localhost:4000/users";

        try
        {
            const peticion = await fetch(url, {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {"Content-Type":"application/json"}
            });
            
            const data = await peticion.json();
            return data;
        }
        catch(error)
        {
            return {error};
        }
    },

    //Actualización
    async updateUserModel(id, data) {
        const url = `http://localhost:4000/users/${id}`;

        try
        {
            const peticion = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {"Content-Type":"application/json"}
            });

            const newData = await peticion.json();
            return newData;
        }
        catch (error)
        {
            return error;
        }
    },


    //Eliminación
    async deleteOneUserModel(cedula) {
        const url = `http://localhost:4000/users/${cedula}`;

        const peticion = await fetch(url, {
            method: "DELETE"
        });

        const data = await peticion.json();

        return data;
    }
}
*/