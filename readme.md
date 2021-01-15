# 🌵 Arkavidia Monopoly Backend

![ESLint Badge](https://github.com/arkavidia-hmif/arkavidia-monopoly-backend/workflows/ESLint/badge.svg)
![Build Docker Badge](https://github.com/arkavidia-hmif/arkavidia-monopoly-backend/workflows/Build%20Docker%20Image/badge.svg)

<!-- ![Arkavidia Logo](https://www.arkavidia.id/img/logo-horizontal.svg) -->

## Prerequisites

NodeJS, developed under v14.15.0 (LTS).

## Running

Install required dependencies:
```bash
yarn
```

Run the project in development mode:
```bash
yarn dev
```

Or preferably, run it in production mode:
```bash
yarn start
```
## Scripts

The scripts inside `package.json` are listed in detail inside the `package-scripts.js` file. This project uses the [nps](https://www.npmjs.com/package/nps) package to manage the scripts.

## Documentation

The complete documentation for the REST API will be available at the endpoint `/docs`. The websocket API documentation will be announced in a further notice.

## Using the API

Example:
`GET http://localhost:3000/api/player` (Returns all listed players)

