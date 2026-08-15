import type { PaginatedResult, PaginationParams } from '../periodicity/periodicity.types.js';
import { RoleRepository } from './role.repository.js';
import type { Role } from './role.types.js';

export class RoleService {
  private readonly roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async getAll(): Promise<Role[]> { 
    return await this.roleRepository.getAll();
  }

  async getAllPaginated(params: PaginationParams): Promise<PaginatedResult<Role>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;
  
    const [data, total] = await Promise.all([
        this.roleRepository.getAllPaginated(limit, offset),
        this.roleRepository.count(),
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