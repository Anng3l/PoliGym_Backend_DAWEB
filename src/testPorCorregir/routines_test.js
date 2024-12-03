/*import request from "supertest";
import app from "../index.js"; // Archivo principal donde se inicializa el servidor
import Rutina from "../models/routines_model.js"; // Modelo de rutinas

describe("Pruebas de los Endpoints de Rutinas", () => {

  jest.mock("../models/routines_model.js");

  // Test 1: Crear una rutina
  it("Debe crear una nueva rutina", async () => {
    const respuesta = await request(app)
      .post("/rutinas")
      .send({
        userId: "1", // Ajusta según los datos de tu base
        coachId: "2",
        name: "Rutina de Prueba",
        description: "Esta es una rutina de prueba",
        exercises: ["Ejercicio 1", "Ejercicio 2"],
      })
      .expect(201); // Código de éxito para creación

    // Verifica que la respuesta contiene los datos esperados
    expect(respuesta.body.userId).toBe("1");
    expect(respuesta.body.coachId).toBe("2");
    expect(respuesta.body.name).toBe("Rutina de Prueba");
    expect(respuesta.body.description).toBe("Esta es una rutina de prueba");
  });

  // Test 2: Obtener todas las rutinas
  it("Debe obtener todas las rutinas", async () => {
    const respuesta = await request(app).get("/rutinas").expect(200);

    // Verifica que devuelve un array
    expect(Array.isArray(respuesta.body)).toBe(true);
  });

  // Test 3: Obtener una rutina por ID
  it("Debe obtener una rutina por ID", async () => {
    const nuevaRutina = await Rutina.create({
      userId: "1",
      coachId: "2",
      name: "Rutina de Prueba",
      description: "Esta es una rutina de prueba",
      exercises: ["Ejercicio 1", "Ejercicio 2"],
    });

    const respuesta = await request(app)
      .get(`/rutinas/${nuevaRutina._id}`)
      .expect(200);

    expect(respuesta.body._id).toBe(String(nuevaRutina._id));
    expect(respuesta.body.name).toBe("Rutina de Prueba");
    expect(respuesta.body.description).toBe("Esta es una rutina de prueba");
  });

  // Test 4: Actualizar una rutina
  it("Debe actualizar una rutina", async () => {
    const rutinaExistente = await Rutina.create({
      userId: "1",
      coachId: "2",
      name: "Rutina de Prueba",
      description: "Esta es una rutina de prueba",
      exercises: ["Ejercicio 1", "Ejercicio 2"],
    });

    const respuesta = await request(app)
      .put(`/rutinas/${rutinaExistente._id}`)
      .send({
        name: "Rutina Actualizada",
        description: "Esta es una descripción actualizada",
      })
      .expect(200);

    expect(respuesta.body.message).toBe("Rutina actualizada exitosamente");
    expect(respuesta.body.data.name).toBe("Rutina Actualizada");
    expect(respuesta.body.data.description).toBe("Esta es una descripción actualizada");
  });

  // Test 5: Eliminar una rutina
  it("Debe eliminar una rutina", async () => {
    const rutina = await Rutina.create({
      userId: "1",
      coachId: "2",
      name: "Rutina de Prueba",
      description: "Esta es una rutina de prueba",
      exercises: ["Ejercicio 1", "Ejercicio 2"],
    });

    const respuesta = await request(app)
      .delete(`/rutinas/${rutina._id}`)
      .expect(200);

    expect(respuesta.body.message).toBe("Rutina eliminada con éxito");

    // Verifica que ya no existe en la base de datos
    const rutinaEliminada = await Rutina.findById(rutina._id);
    expect(rutinaEliminada).toBeNull();
  });
});
*/