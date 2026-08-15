import { UserRepository } from './user.repository.js';
import type { User, UpdateUser, UserResponse, InputUser, CreateUser } from './user.types.js';
import { ConflictError, BadRequestError } from '../../utils/errors.js';
import bcrypt from 'bcrypt';
import type { PaginatedResult, PaginationParams } from '../periodicity/periodicity.types.js';
export class UserService {
  constructor(private userRepository: UserRepository) {}

    async getAll(): Promise<UserResponse[]> {
        const users = await this.userRepository.getAll();
        return users.map(this.toResponse);
    }

    async getAllPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
        const { page, limit } = params;
        const offset = (page - 1) * limit;
    
        const [data, total] = await Promise.all([
          this.userRepository.getAllPaginated(limit, offset),
          this.userRepository.count(),
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

    async getById(id: number): Promise<UserResponse> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const user = await this.userRepository.getById(id);
        return this.toResponse(user);
    }

    async create(userData: InputUser): Promise<UserResponse> {
        if (!userData.email?.trim()) {
            throw new BadRequestError('E-mail é obrigatório.');
        }

        const userWithEmail = await this.userRepository.getByEmail(userData.email); 
        if (userWithEmail) {
            throw new ConflictError('Já existe um usuário cadastrado com este email. Escolha outro, por favor.');
        }

        const passwordHash = await bcrypt.hash(userData.password, 10);

        const userToCreate : CreateUser = {
            email: userData.email,
            name: userData.name,
            passwordHash: passwordHash,
            roleId: userData.roleId
        };

        return this.toResponse(await this.userRepository.create(userToCreate));
    }

    async update(id: number, data: UpdateUser): Promise<UserResponse> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }

        const user = await this.userRepository.getById(id);
        
        if (data.email) {
            const email = await this.userRepository.getByEmail(data.email);
            if (email && user.id !== id) {
                throw new ConflictError('E-mail já está em uso por outro usuário. Tente outro.');
            }
        }
        
        return this.toResponse(await this.userRepository.update(id, data));
    }

    async delete(id: number): Promise<void> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido.');
        }            
        await this.userRepository.delete(id);
    }

    private toResponse(user: User): UserResponse {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}