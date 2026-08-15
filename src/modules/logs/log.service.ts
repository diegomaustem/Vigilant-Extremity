import type { PaginatedResult, PaginationParams } from '../periodicity/periodicity.types.js';
import type { LogRepository } from './log.repository.js';
import type { Log } from './log.types.js';

export class LogService {
  private readonly logRepository: LogRepository;

  constructor(logRepository: LogRepository) {
    this.logRepository = logRepository;
  }

  async getAll(): Promise<Log[]> { 
    return await this.logRepository.getAll();
  }

  async getAllPaginated(params: PaginationParams): Promise<PaginatedResult<Log>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.logRepository.getAllPaginated(limit, offset),
      this.logRepository.count(),
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
}