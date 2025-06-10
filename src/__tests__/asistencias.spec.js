import Asistencia from '../models/asistencia_model.js';
import { crearAsistenciaControllerEntrenador } from "../controllers/asistencias_controller.js";
import { validationResult, check } from 'express-validator';
import mongoose from 'mongoose';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  check: jest.fn(() => ({
    exists: () => ({
      withMessage: () => ({
        isISO8601: () => ({
          withMessage: () => ({
            toDate: () => ({
              run: jest.fn(),
            }),
          }),
        }),
      }),
    }),
  })),
}));

jest.mock('../models/asistencia_model.js');

describe('crearAsistenciaControllerEntrenador', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        idUser: '60f7a6d8e2d3b93f58dbe1b1',
        checkInTime: new Date().toISOString()
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
  });

  test('debe retornar 400 si no se proporciona idUser', async () => {
    req.body.idUser = null;

    await crearAsistenciaControllerEntrenador(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'El id del usuario es requerido.' });
  });

  test('debe retornar 203 si hay campos vacíos en idUser', async () => {
    req.body.idUser = { a: "" };

    await crearAsistenciaControllerEntrenador(req, res);

    expect(res.status).toHaveBeenCalledWith(203);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Debe enviar valores en todos los campos' });
  });

  test('debe retornar 203 si el idUser no es un ObjectId válido', async () => {
    req.body.idUser = 'idInvalido';

    await crearAsistenciaControllerEntrenador(req, res);

    expect(res.status).toHaveBeenCalledWith(203);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Id de usuario incorrecta' });
  });

  test('debe guardar y retornar la asistencia correctamente', async () => {
    req.body.idUser = '60f7a6d8e2d3b93f58dbe1b1';

    const mockSave = jest.fn().mockResolvedValue({
      _id: 'someid',
      ...req.body,
    });

    Asistencia.mockImplementation(() => ({
      save: mockSave
    }));

    await crearAsistenciaControllerEntrenador(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Asistencia creada exitosamente',
      data: expect.any(Object),
    });
  });

  test('debe retornar error 500 si ocurre una excepción', async () => {
    Asistencia.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Error interno')),
    }));

    await crearAsistenciaControllerEntrenador(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Error al intentar crear una asistencia',
      error: 'Error interno'
    }));
  });
});
