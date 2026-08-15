import type { Knex } from 'knex';
import type { User, UpdateUser, UserResponse, CreateUser} from './user.types.js'
import { NotFoundError } from '../../utils/errors.js';

export class UserRepository {
    private db: Knex;
    private readonly userTable = 'users';

    constructor(db: Knex) {
        this.db = db;
    }

    async getAll(): Promise<User[]> {
        const users = await this.db<UserResponse>(this.userTable).select('*');
        return users.map(this.toDomain);
    }

    async getAllPaginated(limit: number, offset: number): Promise<User[]> {
        return await this.db<User>(this.userTable)
          .select('*')
          .orderBy('id', 'asc')
          .limit(limit)
          .offset(offset);
    }

    async getById(id: number): Promise<User> {
        const user = await this.db(this.userTable).where({ id }).first();
        if (!user) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
        }
        return this.toDomain(user);
    }
     
    async getByEmail(email: string): Promise<User | undefined> {
        const user = await this.db(this.userTable).where({ email }).first();
        if (!user) { 
           return undefined; 
        }
        return this.toDomain(user);
    }

    async create(userData: CreateUser): Promise<User> {
        const [user] = await this.db(this.userTable)
            .insert({
                email: userData.email,
                name: userData.name,
                password_hash: userData.passwordHash,
                role_id: userData.roleId
            })
            .returning('*');

        return this.toDomain(user);
    }

    async update(id: number, data: UpdateUser): Promise<User> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.roleId !== undefined) updateData.role_id = data.roleId; 
        if (data.password) updateData.password_hash = data.password;

        const [updated] = await this.db(this.userTable)
            .where({ id })
            .update(updateData)
            .returning('*');

        if (!updated) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<void> {
        const deleted = await this.db(this.userTable).where({ id }).del();

        if(deleted === 0) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
        }
    }

    private toDomain(dbUser: any): User {
        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            passwordHash: dbUser.password_hash,
            roleId: dbUser.role_id ?? 0,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at,
        };
    }

    async count(): Promise<number> {
        const result = await this.db<User>(this.userTable)
            .count<{ total: string | number }>('* as total')
            .first();
        return Number(result?.total) || 0;
    }
}