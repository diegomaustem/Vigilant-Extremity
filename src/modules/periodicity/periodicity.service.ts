import { BadRequestError, ConflictError, NotFoundError } from '../../utils/errors.js';
import type { MonitorRepository } from '../monitor/monitor.repository.js';
import { PeriodicityRepository } from './periodicity.repository.js';
import type { InputPeriodicity, PaginatedResult, PaginationParams, Periodicity } from './periodicity.types.js';

export class PeriodicityService {
  private readonly periodicityRepository: PeriodicityRepository;
  private readonly monitorRepository: MonitorRepository;

  constructor(
    periodicityRepository: PeriodicityRepository,
    monitorRepository: MonitorRepository
  ) {
    this.periodicityRepository = periodicityRepository;
    this.monitorRepository = monitorRepository;
  }

  async getAll(): Promise<Periodicity[]> { 
    return await this.periodicityRepository.getAll();
  }

  async getAllPaginated(params: PaginationParams): Promise<PaginatedResult<Periodicity>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.periodicityRepository.getAllPaginated(limit, offset),
      this.periodicityRepository.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  async getById(periodicityId: number): Promise<Periodicity> {
    return this.periodicityRepository.getById(periodicityId);
  }

  async create(inputPeriodicity: InputPeriodicity): Promise<Periodicity> {
    const existingPeriodicity = await this.periodicityRepository.getByTime(inputPeriodicity.time); 
    
    if (!existingPeriodicity) {
     return await this.periodicityRepository.create(inputPeriodicity);
    }
    
    throw new ConflictError('Já existe um periodo cadastrado com este valor. Escolha outro, por favor.');
  }

  async update(id: number, data: InputPeriodicity): Promise<Periodicity> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
    }
      
    const periodicityWithSameTime = await this.periodicityRepository.getByTime(data.time);
    if (periodicityWithSameTime && periodicityWithSameTime.id !== id) {
      throw new ConflictError('Já existe uma periodicidade cadastrada com este valor. Escolha outro, por favor.');
    }
  
    return this.periodicityRepository.update(id, data);
  }
  
  async delete(id: number): Promise<void> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('ID inválido.');
    } 

    await this.periodicityRepository.getById(id);

    const monitorsCount = await this.getMonitorsCount(id);
      if (monitorsCount > 0) {
        throw new ConflictError(
          `Não é possível excluir esta periodicidade. Ela está sendo usada por ${monitorsCount} monitor(es).`
      );
    }
  
    return this.periodicityRepository.delete(id);
  }

  private async getMonitorsCount(periodicityId: number): Promise<number> {
    const monitors = await this.monitorRepository.getAll();
    return monitors.filter(monitor => monitor.periodicityId === periodicityId).length;
  } 
}