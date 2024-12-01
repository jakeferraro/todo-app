/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  }
};
export const staging = {
  client: 'postgresql',
  connection: {
    database: 'todo_app',
    user: 'jakeferraro',
    password: ''
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const production = {
  client: 'postgresql',
  connection: {
    database: 'todo_app',
    user: 'jakeferraro',
    password: ''
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
