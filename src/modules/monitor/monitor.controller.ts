import type { Request, Response } from 'express';
import { MonitorService } from './monitor.service.js';
import type { InputMonitor } from './monitor.types.js'; 
import { BadRequestError } from '../../utils/errors.js';

export class MonitorController {
    private readonly monitorService: MonitorService;

    constructor(monitorService: MonitorService) {
        this.monitorService = monitorService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const monitors = await this.monitorService.getAll();
        res.status(200).json({ success: true, data: monitors });
    }

    getAllPaginated = async (req: Request, res: Response): Promise<void> => {
        const MAX_LIMIT = 100;
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);

        let limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        limit = Math.min(limit, MAX_LIMIT);

        const result = await this.monitorService.getAllPaginated({ page, limit });
        res.status(200).json(result);
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const monitor = await this.monitorService.getById(id);
        res.status(200).json({ success: true, data: monitor });
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const monitorData : InputMonitor = {
            userId: req.body.userId,
            periodicityId: req.body.periodicityId,
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        };

        const createdMonitor = await this.monitorService.create(monitorData); 
        res.status(201).json({ success: true, data: createdMonitor });
    } 
    
    update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updateData : InputMonitor = {
            userId: req.body.userId,
            periodicityId: req.body.periodicityId,
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        };
        
        const monitorUpdated = await this.monitorService.update(id, updateData);
        res.status(200).json({ success: true, message: 'Monitor atualizado com sucesso.', data: monitorUpdated });
    }
        
    delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.monitorService.delete(id);
        res.status(200).json({ success: true, message: 'Monitor deletado com sucesso.' });
    }
}