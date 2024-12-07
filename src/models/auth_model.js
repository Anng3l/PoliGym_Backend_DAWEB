import mongoose, { mongo } from "mongoose";

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
/*
const autenticacion = {
    async loginUser(email, password) {
        const url = "http://localhost:4000/users";
    
        try {
            const peticion = await fetch(url);
            const data = await peticion.json();

            const user = data.find(user=>user.email === email);

            if (!user)
            {
                return {error: "Usuario o contraseña no son válidos"};
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (user && passwordMatch)
            {
                return user;
            }
            else
            {
                return {error: "Usuario o contraseña no son válidos"};
            }
        }
        catch (error)
        {
            return {error};
        }
    },

    //######################################################### Falta realizar control en el registro para que no se repitan
    async registerUser(newUser) {
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
    }
}

export default autenticacion;*/