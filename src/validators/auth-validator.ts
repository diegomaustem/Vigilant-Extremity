import type { Request, Response, NextFunction } from 'express';
import { BadRequestError } from "../utils/errors.js";
import validator from 'validator';

export class AuthValidator {
  static validateRegister(req: Request, res: Response, next: NextFunction): void {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new BadRequestError('E-mail, senha e nome são obrigatórios.');
    if (!validator.isEmail(email)) {
      throw new BadRequestError('E-mail inválido.');
    }
    if (password.length < 6) throw new BadRequestError('Senha deve ter pelo menos 6 caracteres.');
    next();
  }

  static validateLogin(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError('E-mail e senha são obrigatórios.');
    next();
  }
}