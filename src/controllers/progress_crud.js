const express = require("express");
const mongoose = require("mongoose");
const request = require("supertest");

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/progressDBTest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Esquema y modelo
const DetailSchema = new mongoose.Schema({
  weight: Number,
  muscle_mass: Number,
  fat_mass: Number,
  endurance: Number,
  distance_running: Number,
  time_running: Number,
  grip_strength: Number,
  jump_height: Number,
  max_speed: Number,
});

const ProgressSchema = new mongoose.Schema({
  userId: String,
  routineId: String,
  date: Date,
  details: DetailSchema,
});

const Progress = mongoose.model("Progress", ProgressSchema);

// Rutas CRUD
app.post("/progress", async (req, res) => {
  try {
    const { userId, routineId, date, details } = req.body;
    const progress = new Progress({ userId, routineId, date, details });
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/progress", async (req, res) => {
  try {
    const progresses = await Progress.find();
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/progress/:id", async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/progress/:id", async (req, res) => {
  try {
    const { userId, routineId, date, details } = req.body;
    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      { userId, routineId, date, details },
      { new: true, runValidators: true }
    );
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.status(200).json({ message: "Progress deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Configuración para pruebas con Jest y Supertest
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/progressDBTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Progress CRUD operations", () => {
  let progressId;

  test("Crear un progreso", async () => {
    const response = await request(app).post("/progress").send({
      userId: "12345",
      routineId: "abcde",
      date: "2024-12-03T00:00:00Z",
      details: {
        weight: 70,
        muscle_mass: 35,
        fat_mass: 15,
        endurance: 85,
        distance_running: 5,
        time_running: 30,
        grip_strength: 50,
        jump_height: 60,
        max_speed: 25,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe("12345");
    expect(response.body.details.weight).toBe(70);
    progressId = response.body._id;
  });

  test("Obtener todos los progresos", async () => {
    const response = await request(app).get("/progress");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(progressId);
  });

  test("Obtener un progreso por ID", async () => {
    const response = await request(app).get(`/progress/${progressId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(progressId);
  });

  test("Actualizar un progreso", async () => {
    const response = await request(app).put(`/progress/${progressId}`).send({
      userId: "12345",
      routineId: "newRoutine",
      date: "2024-12-05T00:00:00Z",
      details: {
        weight: 75,
        muscle_mass: 38,
        fat_mass: 14,
        endurance: 90,
        distance_running: 6,
        time_running: 35,
        grip_strength: 55,
        jump_height: 65,
        max_speed: 28,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.routineId).toBe("newRoutine");
    expect(response.body.details.weight).toBe(75);
  });

  test("Eliminar un progreso", async () => {
    const response = await request(app).delete(`/progress/${progressId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Progress deleted successfully");
  });
});

// Inicia el servidor
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
