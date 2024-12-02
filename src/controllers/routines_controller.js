import Rutinas from "../models/routines_model.js"

// Crear una rutina
const createRoutine = async (req, res) => {
  try {
    const { userId, name, description, exercises } = req.body;

    const newRoutine = new Routine({
      userId,
      coachId,
      name,
      description,
      exercises,
    });

    const savedRoutine = await newRoutine.save();
    res.status(201).json(savedRoutine); // Devuelve la rutina creada
  } catch (error) {
    res.status(500).json({ message: "Error al crear la rutina", error });
  }
};

// Obtener todas las rutinas
const getAllRoutines = async (req, res) => {
  try {
    const routines = await Rutinas.find();
    res.status(200).json(routines); // Devuelve todas las rutinas
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las rutinas", error });
  }
};

// Obtener una rutina por ID
const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;
    const routine = await Rutinas.findById(id);

    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    res.status(200).json(routine);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la rutina", error });
  }
};

// Actualizar una rutina
const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, exercises } = req.body;

    const updatedRoutine = await Routine.findByIdAndUpdate(
      id,
      { name,coachId, description, exercises },
      { new: true } // Devuelve la rutina actualizada
    );

    if (!updatedRoutine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    res.status(200).json(updatedRoutine);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la rutina", error });
  }
};

// Eliminar una rutina
const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoutine = await Routine.findByIdAndDelete(id);

    if (!deletedRoutine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    res.status(200).json({ message: "Rutina eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la rutina", error });
  }
};

export {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
};
