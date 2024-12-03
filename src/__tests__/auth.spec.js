import { registerController } from "../controllers/auth_controller.js";
import bcrypt from "bcrypt";
import User from "../models/auth_model.js";
import { v4 as uuidv4 } from "uuid";

jest.mock("bcrypt"); // Mock de bcrypt
jest.mock("../models/auth_model.js"); // Mock del modelo User
jest.mock("uuid", () => ({ v4: jest.fn(() => "mocked-uuid") })); // Mock de uuidv4

describe("registerController", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: "John Doe",
                username: "johndoe",
                email: "johndoe@example.com",
                password: "password123",
                confirmPassword: "password123",
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("debería registrar un usuario correctamente", async () => {
        // Mock del comportamiento de bcrypt.hash
        bcrypt.hash.mockResolvedValue("hashed-password");

        // Mock de User.create
        User.create.mockResolvedValue({
            id: "mocked-uuid",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "hashed-password",
            role: "cliente",
            save: jest.fn().mockResolvedValue(true),
        });

        // Llamar al controlador
        await registerController(req, res);

        // Verificar las respuestas esperadas
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        expect(User.create).toHaveBeenCalledWith({
            id: "mocked-uuid",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "hashed-password",
            role: "cliente",
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Usuario johndoe registrado",
        });
    });

    it("debería retornar error si las contraseñas no coinciden", async () => {
        // Simula contraseñas no coincidentes
        req.body.confirmPassword = "zzz";

        await registerController(req, res);

        expect(res.status).toHaveBeenCalledWith(500); // Verifica que se envió el código 500
        expect(res.json).toHaveBeenCalledWith({
            msg: "Contraseñas distintas",
        });
    });

    it("debería manejar errores inesperados", async () => {
        // Forzar un error en User.create
        User.create.mockImplementation(() => {
            throw new Error("DB error");
        });

        await registerController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            msg: "Error al intentar registrarse",
            error: "DB error",
        });
    });
});
