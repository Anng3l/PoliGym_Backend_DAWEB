import { getAllUsersController, getOneUserController, getUsersByRoleController } from "../controllers/user_controller.js";
import User from "../models/users_model.js";

// Mock del modelo User
jest.mock("../models/users_model.js");

describe("User Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe("getAllUsersController", () => {
    it("debe devolver todos los usuarios", async () => {
      const fakeUsers = [{ username: "juan" }, { username: "maria" }];
      User.find.mockResolvedValue(fakeUsers);

      await getAllUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });

    it("debe manejar errores correctamente", async () => {
      User.find.mockRejectedValue(new Error("DB error"));

      await getAllUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: "Error al listar todos los usuarios"
      }));
    });
  });

  describe("getOneUserController", () => {
    it("debe devolver un usuario por username", async () => {
      const user = { username: "juan" };
      req.params = { username: "juan" };
      User.findOne.mockResolvedValue(user);

      await getOneUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("debe manejar usuario no encontrado", async () => {
      req.params = { username: "noexiste" };
      User.findOne.mockResolvedValue(null);

      await getOneUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(203);
      expect(res.json).toHaveBeenCalledWith({ msg: "No existe usuario con ese nombre de usuario" });
    });

    it("debe manejar errores correctamente", async () => {
      req.params = { username: "error" };
      User.findOne.mockRejectedValue(new Error("DB error"));

      await getOneUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: "Error al listar un usuario"
      }));
    });
  });

  describe("getUsersByRoleController", () => {
    it("debe devolver usuarios con un rol válido", async () => {
      const users = [{ username: "admin1", role: "administrador" }];
      req.params = { role: "administrador" };
      User.find.mockResolvedValue(users);

      await getUsersByRoleController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("debe manejar rol inválido", async () => {
      req.params = { role: "superadmin" };

      await getUsersByRoleController(req, res);

      expect(res.status).toHaveBeenCalledWith(203);
      expect(res.json).toHaveBeenCalledWith({ msg: "El rol ingresado es incorrecto" });
    });

    it("debe manejar errores correctamente", async () => {
      req.params = { role: "cliente" };
      User.find.mockRejectedValue(new Error("DB error"));

      await getUsersByRoleController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: "Error al listar usuarios por rol"
      }));
    });
  });
});
