import type { Request, Response, NextFunction } from 'express';

export class MonitorValidator {
  static validateCheckInput(req: Request, res: Response, next: NextFunction): void {
    const { userId, periodicityId, name, description, url } = req.body;

    if(userId === undefined) {
      res.status(400).json({ success: false, error: 'O campo "user_id" é obrigatório.' });
      return;
    }

     if (typeof userId !== 'number' || isNaN(userId)) {
      res.status(400).json({ success: false, error: 'O campo "user_id" deve ser um número válido.' });
      return;
    }

    if (periodicityId === undefined) {
      res.status(400).json({ success: false, error: 'O campo "periodicity_id" é obrigatório.' });
      return;
    }

    if (typeof periodicityId !== 'number' || isNaN(periodicityId)) {
      res.status(400).json({ success: false, error: 'O campo "periodicity_id" deve ser um número válido.' });
      return;
    }

    if (name === undefined) {
      res.status(400).json({ success: false, error: 'O campo "name" é obrigatório.' });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400).json({ success: false, error: 'O campo "name" deve ser uma string.' });
      return;
    }

    if (name.trim() === '') {
      res.status(400).json({ success: false, error: 'O campo "name" não pode estar vazio.' });
      return;
    }

    if (description === undefined) {
      res.status(400).json({ success: false, error: 'O campo "description" é obrigatório.' });
      return;
    }

    if (typeof description !== 'string') {
      res.status(400).json({ success: false, error: 'O campo "description" deve ser uma string.' });
      return;
    }

    if (description.trim() === '') {
      res.status(400).json({ success: false, error: 'O campo "description" não pode estar vazio.' });
      return;
    }

    if (url === undefined) {
      res.status(400).json({
        success: false,
        error: 'O campo "url" é obrigatório no corpo da requisição.'
      });
      return;
    }

    if (typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'O campo "url" deve ser uma string.' });
      return;
    }

    try {
      new URL(url);
    } catch {
      res.status(422).json({
        success: false,
        error: 'O formato da URL fornecida é inválido. Certifique-se de incluir http:// ou https://.'
      });
      return;
    }
    next();
  }
}