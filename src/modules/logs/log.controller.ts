import type { Request, Response } from 'express';
import type { LogService } from './log.service.js';

export class LogController {
    private readonly logService: LogService;

    constructor(logService: LogService) {
        this.logService = logService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const logs = await this.logService.getAll();
        res.status(200).json({ success: true, data: logs });
    }

    getAllPaginated = async (req: Request, res: Response): Promise<void> => {
        const MAX_LIMIT = 100;
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);

        let limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        limit = Math.min(limit, MAX_LIMIT);

        const result = await this.logService.getAllPaginated({ page, limit });
        res.status(200).json(result);
    }
}