import type { Request, Response } from 'express';
import { PeriodicityService } from './periodicity.service.js';
import type { InputPeriodicity } from './periodicity.types.js';
import { BadRequestError } from '../../utils/errors.js';

export class PeriodicityController {
    private readonly periodicityService: PeriodicityService;

    constructor(periodicityService: PeriodicityService) {
        this.periodicityService = periodicityService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const periodicities = await this.periodicityService.getAll();
        res.status(200).json({ data: periodicities });
    } 

    getAllPaginated = async (req: Request, res: Response): Promise<void> => {
        const MAX_LIMIT = 100;
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);

        let limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        limit = Math.min(limit, MAX_LIMIT);

        const result = await this.periodicityService.getAllPaginated({ page, limit });
        res.status(200).json(result);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const periodicity = await this.periodicityService.getById(id);
        res.status(200).json({ data: periodicity });
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const periodicityData : InputPeriodicity = {
            time: req.body.time,
            status: req.body.status
        };

        const createdPeriodicity = await this.periodicityService.create(periodicityData);
        res.status(201).json({ message: 'Periodicidade criada com sucesso.', data: createdPeriodicity });
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updateData : InputPeriodicity = {
            time: req.body.time,
            status: req.body.status,
        };
    
        const periodicityUpdated = await this.periodicityService.update(id, updateData);
        res.status(200).json({ message: 'Periodicidade atualizada com sucesso.', data: periodicityUpdated });
    }
    
    delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.periodicityService.delete(id);
        res.status(200).json({ message: 'Periodicidade deletada com sucesso.' });
    }
}