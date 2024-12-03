import { crearAsistencia, obtenerAsistencias, actualizarAsistencia, eliminarAsistencia, obtenerAsistenciasPorUsername } from "../controllers/asistencias_controller.js";
import Asistencia from '../models/asistencia_model.js';

jest.mock('../models/asistencia_model.js'); // Mock del modelo

describe('Controlador de Asistencia', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  describe('crearAsistencia', () => {
    it('debería crear una asistencia correctamente', async () => {
      const req = {
        body: {
          userId: '123',
          username: 'testuser',
          date: '2024-12-03',
          status: 'Present',
          checkInTime: '09:00',
          checkOutTime: '17:00',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockSave = jest.fn().mockResolvedValue(req.body);
      Asistencia.mockImplementation(() => ({
        save: mockSave,
      }));

      await crearAsistencia(req, res);

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asistencia creada exitosamente',
        data: req.body,
      });
    });

    it('debería devolver un error si falta el campo username', async () => {
      const req = {
        body: {
          userId: '123',
          date: '2024-12-03',
          status: 'Present',
          checkInTime: '09:00',
          checkOutTime: '17:00',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await crearAsistencia(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "El campo 'username' es requerido." });
    });
  });

  describe('obtenerAsistencias', () => {
    it('debería obtener todas las asistencias', async () => {
      const asistenciasMock = [
        { userId: '123', username: 'testuser', date: '2024-12-03', status: 'Present' },
      ];
      Asistencia.find.mockResolvedValue(asistenciasMock);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await obtenerAsistencias(req, res);

      expect(Asistencia.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asistencias obtenidas exitosamente',
        data: asistenciasMock,
      });
    });
  });

  describe('actualizarAsistencia', () => {
    it('debería actualizar una asistencia correctamente', async () => {
      const req = {
        params: { id: '123' },
        body: { status: 'Absent' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const updatedMock = { _id: '123', status: 'Absent' };
      Asistencia.findByIdAndUpdate.mockResolvedValue(updatedMock);

      await actualizarAsistencia(req, res);

      expect(Asistencia.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: 'Absent' },
        { new: true }
      );
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asistencia actualizada exitosamente',
        data: updatedMock,
      });
    });

    it('debería devolver un error si la asistencia no existe', async () => {
      const req = {
        params: { id: '123' },
        body: { status: 'Absent' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Asistencia.findByIdAndUpdate.mockResolvedValue(null);

      await actualizarAsistencia(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Asistencia no encontrada' });
    });
  });

  describe('eliminarAsistencia', () => {
    it('debería eliminar una asistencia correctamente', async () => {
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const deletedMock = { _id: '123' };
      Asistencia.findByIdAndDelete.mockResolvedValue(deletedMock);

      await eliminarAsistencia(req, res);

      expect(Asistencia.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asistencia eliminada exitosamente',
        data: deletedMock,
      });
    });

    it('debería devolver un error si la asistencia no existe', async () => {
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Asistencia.findByIdAndDelete.mockResolvedValue(null);

      await eliminarAsistencia(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Asistencia no encontrada' });
    });
  });

  describe('obtenerAsistenciasPorUsername', () => {
    it('debería obtener asistencias por username', async () => {
      const req = { params: { username: 'testuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const asistenciasMock = [
        { userId: '123', username: 'testuser', date: '2024-12-03', status: 'Present' },
      ];
      Asistencia.find.mockResolvedValue(asistenciasMock);

      await obtenerAsistenciasPorUsername(req, res);

      expect(Asistencia.find).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Asistencias obtenidas exitosamente',
        data: asistenciasMock,
      });
    });

    it('debería devolver un error si no se encuentran asistencias', async () => {
      const req = { params: { username: 'unknownuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Asistencia.find.mockResolvedValue([]);

      await obtenerAsistenciasPorUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No se encontraron asistencias para el usuario',
      });
    });
  });
});
