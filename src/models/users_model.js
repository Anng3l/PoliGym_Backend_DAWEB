const usuarios = {

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

export default usuarios;