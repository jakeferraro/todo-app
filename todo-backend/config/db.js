import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'jakeferraro', // PostgreSQL username
    password: '', // PostgreSQL password
    database: 'todo_app',
  },
});

export default db;
