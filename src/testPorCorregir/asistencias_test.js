/*
import request from "supertest";
import app from "../index.js";  // Importa tu archivo principal donde se inicializa el servidor
import mongoose from "mongoose";    // Importa mongoose para la base de datos

describe("Pruebas de los Endpoints de Asistencias", () => {
  let dbConnection;

  // Antes de ejecutar las pruebas, conectamos la base de datos
  beforeAll(async () => {
    dbConnection = await mongoose.connect('mongodb://localhost/poliGym_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Después de todas las pruebas, cerramos la conexión
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test 1: Crear asistencia
  it("Debe crear una nueva asistencia", async () => {
    const respuesta = await request(app)
      .post("/asistencias")
      .send({
        userId: "1",  // Cambia a los datos que estés utilizando en tu base de datos
        date: "2024-12-01",
        status: "Presente",
        checkInTime: "2024-12-01T08:00:00.000Z",
        checkOutTime: "2024-12-01T17:00:00.000Z"
      })
      .expect(201);  // Esperamos un código de estado 201

    // Verificar que la respuesta contiene los datos esperados
    expect(respuesta.body.message).toBe("Asistencia creada exitosamente");
    expect(respuesta.body.data.status).toBe("Presente");
    expect(respuesta.body.data.checkInTime).toBe("2024-12-01T08:00:00.000Z");
  });

  // Test 2: Obtener todas las asistencias
  it("Debe obtener todas las asistencias", async () => {
    const respuesta = await request(app)
      .get("/asistencias")
      .expect(200);  // Esperamos un código de estado 200

    // Verificar que la respuesta contiene los datos esperados
    expect(respuesta.body.message).toBe("Asistencias obtenidas exitosamente");
    expect(respuesta.body.data).toBeInstanceOf(Array);
  });

  // Test 3: Obtener asistencia por ID
  it("Debe obtener una asistencia por ID", async () => {
    const asistencia = await request(app)
      .post("/asistencias")
      .send({
        userId: "1",
        date: "2024-12-01",
        status: "Presente",
        checkInTime: "2024-12-01T08:00:00.000Z",
        checkOutTime: "2024-12-01T17:00:00.000Z"
      });

    const respuesta = await request(app)
      .get(`/asistencias/${asistencia.body.data._id}`)
      .expect(200);  // Esperamos un código de estado 200

    expect(respuesta.body.data._id).toBe(asistencia.body.data._id);
    expect(respuesta.body.data.status).toBe("Presente");
  });

  // Test 4: Actualizar una asistencia
  it("Debe actualizar una asistencia", async () => {
    const asistencia = await request(app)
      .post("/asistencias")
      .send({
        userId: "1",
        date: "2024-12-01",
        status: "Presente",
        checkInTime: "2024-12-01T08:00:00.000Z",
        checkOutTime: "2024-12-01T17:00:00.000Z"
      });

    const respuesta = await request(app)
      .put(`/asistencias/${asistencia.body.data._id}`)
      .send({
        status: "Ausente"
      })
      .expect(200);

    expect(respuesta.body.message).toBe("Asistencia actualizada exitosamente");
    expect(respuesta.body.data.status).toBe("Ausente");
  });

  // Test 5: Eliminar una asistencia
  it("Debe eliminar una asistencia", async () => {
    const asistencia = await request(app)
      .post("/asistencias")
      .send({
        userId: "1",
        date: "2024-12-01",
        status: "Presente",
        checkInTime: "2024-12-01T08:00:00.000Z",
        checkOutTime: "2024-12-01T17:00:00.000Z"
      });

    const respuesta = await request(app)
      .delete(`/asistencias/${asistencia.body.data._id}`)
      .expect(200);

    expect(respuesta.body.message).toBe("Asistencia eliminada exitosamente");
  });
});
*/