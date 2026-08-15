import type { Knex } from 'knex';

const MIGRATION_NAME = "20260620195852_add_user_id_to_monitor";

export async function up(knex: Knex): Promise<void> {

    console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating relation users on monitors.`);

    const columnExists = await knex.schema.hasColumn('monitor', 'user_id');
    if (!columnExists) {
        await knex.schema.alterTable('monitor', (table) => {
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('monitor', (table) => {
        table.dropForeign(['user_id']);
        table.dropColumn('user_id');
    });
}