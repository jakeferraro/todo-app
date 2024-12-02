export function up(knex) {
    return knex.schema.table('tasks', (table) => {
      table.text('description').nullable();
    });
  }
  
  export function down(knex) {
    return knex.schema.table('tasks', (table) => {
      table.dropColumn('description'); // Remove description column if rolling back
    });
  }
  