import type { Knex } from 'knex';
import type { Periodicity, InputPeriodicity } from './periodicity.types.js';
import { NotFoundError } from '../../utils/errors.js';

export class PeriodicityRepository {
  private db: Knex;
  private readonly periodicityTable = 'periodicity';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Periodicity[]> {
    return await this.db<Periodicity>(this.periodicityTable).select('*');
  }

  async getAllPaginated(limit: number, offset: number): Promise<Periodicity[]> {
    return await this.db<Periodicity>(this.periodicityTable)
      .select('*')
      .orderBy('id', 'asc')
      .limit(limit)
      .offset(offset);
  }

  async getById(id: number): Promise<Periodicity> {
    const periodicity = await this.db(this.periodicityTable)
      .where({ id })
      .first();

    if (!periodicity) {
      throw new NotFoundError(`Periodicidade com ID ${id} não encontrado.`);
    }
    return periodicity;
  }

  async getByTime(time: string): Promise<Periodicity | null> {
    const periodicity = await this.db(this.periodicityTable)
      .where('time', time)
      .first();

    return periodicity || null;
  }

  async create(inputPeriodicity: InputPeriodicity): Promise<Periodicity> {
    const [newPeriodicity] = await this.db(this.periodicityTable)
      .insert({
        time: inputPeriodicity.time,
        status: inputPeriodicity.status
      })
      .returning('*'); 
    return newPeriodicity;
  }

  async update(id: number, data: InputPeriodicity): Promise<Periodicity> {
    const updateData: any = {};
    if (data.time) updateData.time = data.time;
    if (data.status) updateData.status = data.status;
              
    const [updated] = await this.db(this.periodicityTable)
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!updated) {
      throw new NotFoundError(`Periodicidade com ID ${id} não encontrado para atualizar.`);
    }
    return updated;
  }
  
  async delete(id: number): Promise<void> {
    const deleted = await this.db(this.periodicityTable).where({ id }).del();
    if(deleted === 0) {
      throw new NotFoundError(`Periodicidade com ID ${id} não encontrada.`);
    }
  }

  async count(): Promise<number> {
    const result = await this.db<Periodicity>(this.periodicityTable)
      .count<{ total: string | number }>('* as total')
      .first();
    return Number(result?.total) || 0;
  }
}