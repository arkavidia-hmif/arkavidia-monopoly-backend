module.exports = {
  scripts: {
    default: {
      script:
        "cross-env NODE_ENV=production ts-node-transpile-only -r tsconfig-paths/register src/app.ts",
      description: "Run the API in production mode.",
    },
    dev: {
      script:
        "nodemon --exec ts-node-transpile-only -r tsconfig-paths/register src/app.ts",
      description: "Run the API in development mode.",
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
        script: "eslint .",
        description: "Run ESLint to check for code style inconsistency.",
      },
      fix: {
        script: "eslint . --fix",
        description: "Fix some fixable code inconsistency using ESLint.",
      },
    },
  },
};
