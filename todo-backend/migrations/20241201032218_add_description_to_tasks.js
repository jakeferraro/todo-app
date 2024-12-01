// add_description_to_tasks.js
export function up(knex) {
    return knex.schema.table('tasks', (table) => {
      table.string('description').nullable(); // Add description column
    });
  }
  
  export function down(knex) {
    return knex.schema.table('tasks', (table) => {
      table.dropColumn('description'); // Remove description column if rolling back
    });
  }
  