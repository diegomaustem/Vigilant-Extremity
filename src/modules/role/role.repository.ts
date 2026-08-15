import type { Knex } from 'knex';
import type { Role } from './role.types.js';

export class RoleRepository {
  private db: Knex;
  private readonly roleTable = 'roles';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Role[]>{
    const rows = await this.db(this.roleTable).select('*');
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getAllPaginated(limit: number, offset: number): Promise<Role[]> {
    return await this.db<Role>(this.roleTable)
      .select('*')
      .orderBy('id', 'asc')
      .limit(limit)
      .offset(offset);
  }

    async count(): Promise<number> {
      const result = await this.db<Role>(this.roleTable)
        .count<{ total: string | number }>('* as total')
        .first();
      return Number(result?.total) || 0;
    }
}