import type { Request, Response, NextFunction } from 'express';

export class PeriodicityValidator {
  static validateCheckInput(req: Request, res: Response, next: NextFunction): void {
    const { time, status } = req.body;

    if (time === undefined) {
      res.status(400).json({ success: false, error: 'O campo "periodo" é obrigatório.' });
      return;
    }

    if (typeof time !== 'string') {
      res.status(400).json({ success: false, error: 'O campo "periodo" deve ser uma string.' });
      return;
    }

    if (time.trim() === '') {
      res.status(400).json({ success: false, error: 'O campo "periodo" não pode estar vazio.' });
      return;
    }

    if (status === undefined) {
      res.status(400).json({ success: false, error: 'O campo "status" é obrigatório.' });
      return;
    }

    if (typeof status !== 'boolean') {
      res.status(400).json({ success: false, error: 'O campo "status" deve ser um booleano.' });
      return;
    }
    next();
  }
}