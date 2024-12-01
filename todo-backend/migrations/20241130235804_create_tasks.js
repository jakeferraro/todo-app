export function up(knex)  {   return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('folder_id').unsigned().references('id').inTable('folders').onDelete('CASCADE');
    table.timestamps(true, true);
  });   }

export function down(knex) { return knex.schema.dropTable('tasks'); }
