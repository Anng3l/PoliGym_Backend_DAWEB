import Progress from "../models/progresos_model.js";

// Rutas CRUD
const createOneProgressController = async (req, res) => {
    try {
        const { id, username, routineId, date, details } = req.body;
        const progress = new Progress({ id, username, routineId, date, details });
        await progress.save();
        return res.status(201).json(progress);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getAllProgressesController = async (req, res) => {
    try {
        const progresses = await Progress.find();
        return res.status(200).json(progresses);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getOneProgressController = async (req, res) => {
    const {username} = req.params;

    try {
        const progress = await Progress.find({username});
        if (!progress) return res.status(404).json({ message: "Progress not found" });
        return res.status(200).json(progress);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateOneProgressController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const progress = await Progress.updateOne({id}, {$set: data});
        if (!progress) return res.status(404).json({ message: "Progress not found" });
        return res.status(200).json(progress);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteOneProgressController = async (req, res) => {
    const { id } = req.params
    try {
        const progress = await Progress.findOneAndDelete({id});
        if (!progress) return res.status(404).json({ message: "Progress not found" });
        return res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export {
    createOneProgressController,
    getAllProgressesController,
    getOneProgressController,
    updateOneProgressController,
    deleteOneProgressController
}
