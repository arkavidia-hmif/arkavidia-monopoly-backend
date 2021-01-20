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
      script: "ts-mocha --paths tests/**/*.ts --timeout 15000 --sort",
      description: "Run unit test on the API.",
    },
  },
};
