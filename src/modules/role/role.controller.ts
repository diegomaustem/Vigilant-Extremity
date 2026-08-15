import type { Request, Response } from 'express';
import type { RoleService } from './role.service.js';

export class RoleController {
    private readonly roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const roles = await this.roleService.getAll();
        res.status(200).json({ success: true, data: roles });
    }

    getAllPaginated = async (req: Request, res: Response): Promise<void> => {
        const MAX_LIMIT = 100;
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);

        let limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        limit = Math.min(limit, MAX_LIMIT);

        const result = await this.roleService.getAllPaginated({ page, limit });
        res.status(200).json(result);
    }
}