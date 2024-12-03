import { logInController } from "../controllers/auth_controller.js";
import User from "../models/auth_model.js";
import bcrypt from "bcrypt";
import {createToken} from "../middlewares/auth.js";

// Mocks de dependencias
jest.mock("../models/auth_model.js");
jest.mock("bcrypt");
jest.mock("../middlewares/auth.js");

describe("logInController", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: "johndoe@example.com",
                password: "password123",
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it("debería devolver un token si las credenciales son correctas", async () => {
        // Mock de User.findOne
        User.findOne.mockResolvedValue({
            id: "123",
            role: "cliente",
            password: "hashed-password",
        });

        // Mock de bcrypt.compare
        bcrypt.compare.mockResolvedValue(true);
        // Mock de createToken
        createToken.mockResolvedValue("mocked-token");

        // Llamar al controlador
        await logInController(req, res);

        // Verificar que se buscó al usuario
        expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
        // Verificar que se comparó la contraseña
        expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed-password");
        // Verificar que se creó el token
        expect(createToken).toHaveBeenCalledWith({ id: "123", role: "cliente" });

        // Verificar la respuesta esperada
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mocked-token" });
    });

    it("debería devolver un error si el usuario no existe", async () => {
        // Mock de User.findOne que no encuentra al usuario
        User.findOne.mockResolvedValue(null);

        await logInController(req, res);

        // Verificar que se buscó al usuario
        expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });

        // Verificar la respuesta de error
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Credenciales incorrectas" });
    });

    it("debería devolver un error si la contraseña es incorrecta", async () => {
        // Mock de User.findOne
        User.findOne.mockResolvedValue({
            id: "123",
            role: "cliente",
            password: "hashed-password",
        });

        // Mock de bcrypt.compare que indica que la contraseña es incorrecta
        bcrypt.compare.mockResolvedValue(false);

        await logInController(req, res);

        // Verificar que se buscó al usuario
        expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });

        // Verificar que se comparó la contraseña
        expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed-password");

        // Verificar la respuesta de error
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Credenciales incorrectas" });
    });

    it("debería manejar errores inesperados", async () => {
        // Mock de User.findOne que lanza un error
        User.findOne.mockImplementation(() => {
            throw new Error("DB error");
        });

        await logInController(req, res);

        // Verificar la respuesta de error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            msg: "Error al intentar iniciar sesión",
            error: "DB error",
        });
    });
});
