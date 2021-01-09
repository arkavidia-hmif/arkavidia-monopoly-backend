module.exports = {
  scripts: {
    default: {
      script:
        "cross-env NODE_ENV=production ts-node-transpile-only -r tsconfig-paths/register src/index.ts",
      description: "Run the API in production mode.",
    },
    dev: {
      script:
        "nodemon --exec ts-node-transpile-only -r tsconfig-paths/register src/index.ts",
      description: "Run the API in development mode.",
    },
    "test-server": {
      script:
        "cross-env NODE_ENV=test nodemon --exec ts-node-transpile-only -r tsconfig-paths/register src/index.ts",
      description: "Run the API in test mode.",
    },
    seed: {
      config: {
        script:
          "ts-node -r tsconfig-paths/register ./node_modules/typeorm-seeding/dist/cli.js config",
        description: "Check TypeORM config for seeding.",
      },
      run: {
        script:
          "ts-node -r tsconfig-paths/register  ./node_modules/typeorm-seeding/dist/cli.js seed",
        description:
          "Seed the database with predefined data from the seeds directory listed in the ORM config.",
      },
    },
    schema: {
      drop: {
        script: "ts-node ./node_modules/typeorm/cli.js schema:drop",
        description: "Drop schema from database.",
      },
      sync: {
        script: "ts-node ./node_modules/typeorm/cli.js schema:sync",
        description: "Synchronize schema to database.",
      },
    },
    lint: {
      check: {
        script: "eslint --max-warnings 0 --ext .ts .",
        description: "Run ESLint to check for code style inconsistency.",
      },
      fix: {
        script: "eslint --ext .ts . --fix",
        description: "Fix some fixable code inconsistency using ESLint.",
      },
    },
    test: {
      script:
        "env TS_NODE_COMPILER_OPTIONS='{\"module\": \"commonjs\" }' mocha -r ts-node/register 'tests/**/*.test.ts'",
      description: "Run unit test on the API.",
    },
  },
};
