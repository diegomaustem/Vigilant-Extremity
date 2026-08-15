import type { Knex } from 'knex';

const MIGRATION_NAME = "20260620012133_create_users_table";

export async function up(knex: Knex): Promise<void> {
    console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating users table if not exists.`);

    const exists = await knex.schema.hasTable('users');
    if (!exists) {
        await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('name').notNullable();
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}