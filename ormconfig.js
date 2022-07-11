require('dotenv/config');

let config = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [process.env.ENTITIES_DIR],
  migrations: [process.env.MIGRATIONS_DIR],
  cli: {
    entitiesDir: 'src/core/infra/database/entities',
    migrationsDir: 'src/core/infra/database/migrations',
  },
  subscribers: [],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

if (process.env.NODE_ENV === 'test') {
  config = {
    type: 'sqlite',
    database: './dbtest.sqlite',
    synchronize: false,
    entities: [process.env.ENTITIES_DIR],
    migrations: ['tests/core/infra/database/migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/core/infra/database/entities',
      migrationsDir: 'tests/core/infra/database/migrations',
    },
    subscribers: [],
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
}
module.exports = config;
