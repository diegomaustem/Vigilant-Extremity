import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

const errorMapping = new Map<string | number, { status: number; message: string }>([
  // Validation of errors
  ['ValidationError', { status: 400, message: 'Dados inválidos ou mal formatados.' }],
  ['entity.parse.failed', { status: 400, message: 'Dados inválidos ou mal formatados.' }],
  ['23502', { status: 400, message: 'Dados inválidos ou mal formatados.' }],
  ['22P02', { status: 400, message: 'Dados inválidos ou mal formatados.' }],

  // Conflict of errors
  ['23505', { status: 409, message: 'Conflito: recurso já existe ou referência inválida.' }],
  ['23503', { status: 409, message: 'Conflito: recurso já existe ou referência inválida.' }],
]);

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro capturado:', err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  const key = err.code || err.name || err.type;
  const mapped = errorMapping.get(key);
  if (mapped) {
    return res.status(mapped.status).json({
      success: false,
      message: mapped.message,
    });
  }
  
 return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
  });
};