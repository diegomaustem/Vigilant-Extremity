import type { Knex } from 'knex';

const MIGRATION_NAME = "20260627231631_add_role_id_to_users";

export async function up(knex: Knex): Promise<void> {
  console.log(`[MIGRATION] ${MIGRATION_NAME}: Adding role_id foreign key to users.`);

  const columnExists = await knex.schema.hasColumn('users', 'role_id');
  if (!columnExists) {
    await knex.schema.alterTable('users', (table) => {
      table.integer('role_id').unsigned().references('roles.id').onDelete('SET NULL');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const columnExists = await knex.schema.hasColumn('users', 'role_id');
  if (columnExists) {
    await knex.schema.alterTable('users', (table) => {
      table.dropForeign(['role_id']);
      table.dropColumn('role_id');
    });
  }
}