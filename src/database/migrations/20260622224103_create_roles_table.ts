import type { Knex } from 'knex';

const MIGRATION_NAME = '20260622224103_create_roles_table';

export async function up(knex: Knex): Promise<void> {
  console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating roles table.`);

  const rolesExists = await knex.schema.hasTable('roles');
  if (!rolesExists) {
    await knex.schema.createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name', 50).unique().notNullable();
      table.text('description').nullable();
      table.timestamps(true, true);
    });
    
    await knex('roles').insert([
      { name: 'user', description: 'Usuário comum' },
      { name: 'admin', description: 'Administrador' },
      { name: 'moderator', description: 'Moderador' },
    ]);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('roles');
}