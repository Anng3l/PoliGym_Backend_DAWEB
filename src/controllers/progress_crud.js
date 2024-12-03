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



// Inicia el servidor
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
