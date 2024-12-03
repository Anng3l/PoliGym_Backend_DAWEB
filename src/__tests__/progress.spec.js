import {
  createOneProgressController,
  getAllProgressesController,
  getOneProgressController,
  updateOneProgressController,
  deleteOneProgressController,
} from '../controllers/progress_controller.js';
import Progress from '../models/progresos_model.js';

jest.mock('../models/progresos_model.js'); // Mock del modelo

describe('Controladores de Progress', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  describe('createOneProgressController', () => {
    it('debería crear un progreso correctamente', async () => {
      const req = {
        body: {
          id: '1',
          username: 'testuser',
          routineId: 'routine123',
          date: '2024-12-03',
          details: 'Worked out for 1 hour',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockSave = jest.fn().mockResolvedValue(req.body);
      Progress.mockImplementation(() => ({
        save: mockSave,
      }));

      await createOneProgressController(req, res);

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('debería manejar errores al crear un progreso', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = 'Validation error';
      Progress.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error(errorMessage)),
      }));

      await createOneProgressController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getAllProgressesController', () => {
    it('debería obtener todos los progresos', async () => {
      const progressesMock = [
        { id: '1', username: 'testuser', routineId: 'routine123', date: '2024-12-03', details: 'Worked out for 1 hour' },
      ];
      Progress.find.mockResolvedValue(progressesMock);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllProgressesController(req, res);

      expect(Progress.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(progressesMock);
    });

    it('debería manejar errores al obtener progresos', async () => {
      const errorMessage = 'Database error';
      Progress.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllProgressesController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getOneProgressController', () => {
    it('debería obtener un progreso por username', async () => {
      const req = { params: { username: 'testuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const progressMock = [{ id: '1', username: 'testuser', routineId: 'routine123' }];
      Progress.find.mockResolvedValue(progressMock);

      await getOneProgressController(req, res);

      expect(Progress.find).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(progressMock);
    });

    it('debería manejar errores al buscar un progreso', async () => {
      const req = { params: { username: 'unknownuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Progress.find.mockResolvedValue([]);

      await getOneProgressController(req, res);

      expect(res.status)
      expect(res.json({ message: 'Progress not found' }))
    });
  });

  describe('updateOneProgressController', () => {
    it('debería actualizar un progreso correctamente', async () => {
      const req = { params: { id: '1' }, body: { details: 'Updated details' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const updateMock = { matchedCount: 1, modifiedCount: 1 };
      Progress.updateOne.mockResolvedValue(updateMock);

      await updateOneProgressController(req, res);

      expect(Progress.updateOne).toHaveBeenCalledWith({ id: '1' }, { $set: req.body });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updateMock);
    });

    it('debería devolver un error si el progreso no existe', async () => {
      const req = { params: { id: '1' }, body: { details: 'Updated details' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Progress.updateOne.mockResolvedValue(null);

      await updateOneProgressController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Progress not found' });
    });
  });

  describe('deleteOneProgressController', () => {
    it('debería eliminar un progreso correctamente', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const deleteMock = { id: '1' };
      Progress.findOneAndDelete.mockResolvedValue(deleteMock);

      await deleteOneProgressController(req, res);

      expect(Progress.findOneAndDelete).toHaveBeenCalledWith({ id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Progress deleted successfully' });
    });

    it('debería manejar errores si el progreso no existe', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Progress.findOneAndDelete.mockResolvedValue(null);

      await deleteOneProgressController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Progress not found' });
    });
  });
});
