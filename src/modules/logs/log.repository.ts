import type { Knex } from 'knex';
import type { Log, InputLog } from './log.types.js';
import { NotFoundError } from '../../utils/errors.js';

export class LogRepository {
  private db: Knex;
  private readonly logsTable = 'monitor_logs';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Log[]> {
    return await this.db<Log>(this.logsTable).select('*');
  }

  async getAllPaginated(limit: number, offset: number): Promise<Log[]> {
    return await this.db<Log>(this.logsTable)
      .select('*')
      .orderBy('id', 'asc')
      .limit(limit)
      .offset(offset);
  }

  async getLogByMonitorId(monitor_id: number): Promise<Log | null> {
    const log = await this.db(this.logsTable)
      .where({ monitor_id })
      .first();

    if(!log) {
      return null;
    }
    return {
      id: log.id,
      monitorId: log.monitor_id,
      url: log.url,
      isUp: log.is_up,
      statusCode: log.status_code,
      responseTimeMs: log.response_time_ms,
      errorMessage: log.error_message,
      checkedAt: log.checked_at,
    };
  }

  async upsert(logData: InputLog): Promise<Log> {
    const [saved] = await this.db(this.logsTable)
      .insert({
        monitor_id: logData.monitorId,
        url: logData.url,
        is_up: logData.isUp,
        status_code: logData.statusCode,
        response_time_ms: logData.responseTimeMs,
        error_message: logData.errorMessage,
        checked_at: logData.checkedAt,
      })
      .onConflict('monitor_id')
      .merge({
        url: logData.url,
        is_up: logData.isUp,
        status_code: logData.statusCode,
        response_time_ms: logData.responseTimeMs,
        error_message: logData.errorMessage,
        checked_at: logData.checkedAt,
      })
      .returning('*');

    return {
      id: saved.id,
      monitorId: saved.monitor_id,
      url: saved.url,
      isUp: saved.is_up,
      statusCode: saved.status_code,
      responseTimeMs: saved.response_time_ms,
      errorMessage: saved.error_message,
      checkedAt: saved.checked_at,
    };
  }

  async count(): Promise<number> {
    const result = await this.db<Log>(this.logsTable)
      .count<{ total: string | number }>('* as total')
      .first();
    return Number(result?.total) || 0;
  }
}