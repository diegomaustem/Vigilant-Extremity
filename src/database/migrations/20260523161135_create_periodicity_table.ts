import type { Knex } from "knex";

const MIGRATION_NAME = "20260523161135_create_periodicity_table";

export async function up(knex: Knex): Promise<void> {
    console.log(`[MIGRATION] ${MIGRATION_NAME}: Creating periodicity table if not exists.`);

    const tableExists = await knex.schema.hasTable('periodicity');

    if (!tableExists) {
        await knex.schema.createTable("periodicity", (table) => {
            table.increments("id").primary(); 
            table.string("time", 30).notNullable(); 
            table.boolean("status").notNullable();
            table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
            table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now()).notNullable();
        });
        console.log(`[MIGRATION] ${MIGRATION_NAME}: periodicity table ready.`);
    } else {
        console.log(`[MIGRATION] ${MIGRATION_NAME}: periodicity table already exists, skipping.`);
    }
}

export async function down(knex: Knex): Promise<void> {
    console.log(`[MIGRATION] ${MIGRATION_NAME}: Dropping periodicity table`);
    await knex.schema.dropTableIfExists("periodicity");
}