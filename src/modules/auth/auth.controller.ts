import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response): Promise<void> => {
        const { email, password, name } = req.body;
        const user = await this.authService.register(email, password, name);
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso.', data: user });
    };

    login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);
        res.status(200).json({ success: true, data: result });
    };
}