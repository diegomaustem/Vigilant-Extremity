import type { Knex } from 'knex';

const MIGRATION_NAME = "20260618232817_create_monitor_logs_table";

export async function up(knex: Knex): Promise<void> {
    console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating monitor logs table if not exists.`);

    const exists = await knex.schema.hasTable('monitor_logs');
    if (!exists) {
        await knex.schema.createTable('monitor_logs', (table) => {
            table.increments('id').primary();
            table.integer('monitor_id').unsigned().notNullable().unique();
            table.string('url').notNullable();
            table.boolean('is_up').notNullable();
            table.integer('status_code').nullable();
            table.integer('response_time_ms').nullable();
            table.text('error_message').nullable();
            table.timestamp('checked_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();

            table.foreign('monitor_id')
                .references('monitor.id')
                .onDelete('CASCADE');
        });
    }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('monitor_logs');
}