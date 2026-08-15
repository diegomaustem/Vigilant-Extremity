import type { Knex } from "knex";

const MIGRATION_NAME = "20260523161136_create_monitor_table";

export async function up(knex: Knex): Promise<void> {
  console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating monitor table if not exists.`);

  const tableExists = await knex.schema.hasTable('monitor');

  if (!tableExists) {
    await knex.schema.createTable("monitor", (table) => {
      table.increments("id").primary();
      table.integer("periodicity_id").unsigned().notNullable().references("periodicity.id").onDelete("RESTRICT");
      table.string("name", 100).notNullable(); 
      table.string("description", 255).notNullable(); 
      table.string("url").notNullable();
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
    });
    console.log(`[MIGRATION] ${MIGRATION_NAME}: monitor table ready.`);
  } else {
    console.log(`[MIGRATION] ${MIGRATION_NAME}: monitor table already exists, skipping.`);
  }
}

export async function down(knex: Knex): Promise<void> {
  console.log(`[MIGRATION] ${MIGRATION_NAME}: Dropping monitor table`);
  await knex.schema.dropTableIfExists("monitor");
}