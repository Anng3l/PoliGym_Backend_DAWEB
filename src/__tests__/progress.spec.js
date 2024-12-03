import request from "supertest";
import app from "../index.js"; // Archivo principal del servidor
import Progress from "../models/progresos_model.js";

// Mock del modelo Progress
jest.mock("../models/progresos_model.js");

describe("Pruebas de los Endpoints de Progresos", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  // Test 1: Crear un progreso
  it("Debe crear un nuevo progreso", async () => {
    Progress.prototype.save = jest.fn().mockResolvedValue({
      _id: "mocked-id",
      userId: "1",
      routineId: "2",
      date: "2024-11-01",
      details: "Progreso detallado",
    });

    const respuesta = await request(app)
      .post("/progresos")
      .send({
        userId: "1",
        routineId: "2",
        date: "2024-11-01",
        details: "Progreso detallado",
      })
      .expect(201);

    expect(respuesta.body.userId).toBe("1");
    expect(respuesta.body.routineId).toBe("2");
    expect(respuesta.body.details).toBe("Progreso detallado");
  });

  // Test 2: Obtener todos los progresos
  it("Debe obtener todos los progresos", async () => {
    Progress.find.mockResolvedValue([
      {
        _id: "mocked-id",
        userId: "1",
        routineId: "2",
        date: "2024-11-01",
        details: "Progreso detallado",
      },
    ]);

    const respuesta = await request(app).get("/progresos").expect(200);

    expect(Array.isArray(respuesta.body)).toBe(true);
    expect(respuesta.body.length).toBeGreaterThan(0);
    expect(respuesta.body[0].details).toBe("Progreso detallado");
  });

  // Test 3: Obtener un progreso por ID
  it("Debe obtener un progreso por ID", async () => {
    Progress.findById.mockResolvedValue({
      _id: "mocked-id",
      userId: "1",
      routineId: "2",
      date: "2024-11-01",
      details: "Progreso detallado",
    });

    const respuesta = await request(app).get("/progresos/mocked-id").expect(200);

    expect(respuesta.body._id).toBe("mocked-id");
    expect(respuesta.body.details).toBe("Progreso detallado");
  });

  // Test 4: Actualizar un progreso
  it("Debe actualizar un progreso", async () => {
    Progress.findByIdAndUpdate.mockResolvedValue({
      _id: "mocked-id",
      userId: "1",
      routineId: "2",
      date: "2024-11-02",
      details: "Progreso actualizado",
    });

    const respuesta = await request(app)
      .put("/progresos/mocked-id")
      .send({
        userId: "1",
        routineId: "2",
        date: "2024-11-02",
        details: "Progreso actualizado",
      })
      .expect(200);

    expect(respuesta.body.details).toBe("Progreso actualizado");
  });

  // Test 5: Eliminar un progreso
  it("Debe eliminar un progreso", async () => {
    Progress.findByIdAndDelete.mockResolvedValue({
      _id: "mocked-id",
      userId: "1",
      routineId: "2",
      date: "2024-11-01",
      details: "Progreso detallado",
    });

    const respuesta = await request(app).delete("/progresos/mocked-id").expect(200);

    expect(respuesta.body.message).toBe("Progress deleted successfully");
    expect(Progress.findByIdAndDelete).toHaveBeenCalledWith("mocked-id");
  });

  // Test 6: Manejo de error al crear un progreso
  it("Debe manejar errores al crear un progreso", async () => {
    Progress.prototype.save = jest.fn().mockRejectedValue(new Error("DB error"));

    const respuesta = await request(app)
      .post("/progresos")
      .send({
        userId: "1",
        routineId: "2",
        date: "2024-11-01",
        details: "Progreso detallado",
      })
      .expect(400);

    expect(respuesta.body.message).toBe("DB error");
  });
});
