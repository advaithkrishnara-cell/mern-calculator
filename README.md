# MERN Calculator

A beginner-friendly calculator built with React, Express, Node.js, and MongoDB. The frontend sends expressions to the backend, which evaluates calculator syntax with a dedicated parser rather than JavaScript `eval`. MongoDB stores recent calculation history; arithmetic still works when MongoDB is unavailable.

## Project Structure

```text
client/                         React + Vite frontend
	src/components/               One folder per component, with JSX and CSS
	src/services/calculatorApi.js Frontend API requests
server/                         Express backend
	src/config/                   MongoDB connection
	src/controllers/              HTTP request handlers
	src/middleware/               API error handling
	src/models/                   Mongoose schemas
	src/routes/                   API endpoint definitions
	src/services/                 Calculation and history logic
	src/utils/                    Safe expression parser
	test/                         Node.js backend tests
package.json                    npm workspace scripts
package-lock.json               Locked dependency versions
```

The root `index.html` and `script.js` are older, standalone Study Planner starter files. The MERN calculator runs from `client/`; those root files are not used by its build or dev server.

## Prerequisites

- Node.js 20 or newer and npm
- MongoDB local or hosted, only if persistent history is needed
- Git for version control

## Install From A Fresh Clone

Run from the repository root. npm workspaces install the frontend and backend dependencies together:

```powershell
npm ci
```

Copy the example environment files:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Edit `server/.env` locally. Set `MONGODB_URI` to your local or hosted MongoDB connection string. Never commit `.env` files or put production secrets in source code. `client/.env` is optional for local development because Vite proxies `/api` to the backend.

## Run The Applications

Start both development servers from the repository root:

```powershell
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health

To run one server in its own terminal:

```powershell
npm run dev:client
npm run dev:server
```

For PowerShell environments that block the `npm` shim, use `npm.cmd` in place of `npm`.

## Environment Variables

Backend variables in `server/.env`:

| Variable | Purpose | Local default/example |
| --- | --- | --- |
| `PORT` | HTTP port; Render provides this automatically in production. | `5000` |
| `MONGODB_URI` | MongoDB connection string. Optional for calculations; needed for saved history. | `mongodb://127.0.0.1:27017/mern-calculator` |
| `CLIENT_ORIGIN` | Allowed frontend origin(s) for cross-origin browser requests. Separate multiple origins with commas. | `http://localhost:5173` |

Frontend variable in `client/.env`:

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_API_URL` | API base URL; Vite embeds this value in the public frontend build. Do not put secrets here. | `/api` locally, or `https://your-api.onrender.com/api` when separately hosted |

Local development uses Vite's `/api` proxy to `http://localhost:5000`; that localhost target is development configuration, not the deployed API URL. Set `VITE_API_URL` to the deployed API base URL before building a separately hosted frontend.

## Build, Test, And Start

From the repository root:

```powershell
npm test
npm run build
npm start
```

`npm test` runs the backend parser/service tests. `npm run build` creates the frontend production bundle under `client/dist/` (ignored by Git). `npm start` starts the backend using `PORT` or port `5000` by default.

Equivalent backend commands from `server/` are `npm test`, `npm run dev`, and `npm start`. Frontend commands from `client/` are `npm run dev` and `npm run build`.

## API

- `GET /api/health` returns API and MongoDB status.
- `POST /api/calculator/calculate` accepts `{"expression":"5 + 3 * 2"}` and returns `{"expression":"5 + 3 * 2","result":11}`. Successful calculations are saved when MongoDB is connected.
- `GET /api/calculator/history` returns up to 20 recent calculations; it returns HTTP 503 while MongoDB is unavailable.

The parser supports decimals, negative values, parentheses, `+`, `-`, `*`, `/`, `^`, and postfix `%`. It rejects malformed expressions and division by zero.

## Git And Secret Safety

Commit source code, documentation, `.env.example` files, and `package-lock.json`. Do not commit `.env`, credentials, API keys, tokens, private keys, `node_modules/`, logs, or build output. The root `.gitignore` excludes these local/generated files. Review `git status` and staged files before creating a commit.

## Future Render Backend Deployment

No deployment is performed by this project setup. When ready to deploy the backend:

1. Push this repository to GitHub after verifying no secrets are staged.
2. In Render, create a **Web Service** connected to the repository. Keep the **Root Directory** at the repository root so Render can use the npm workspaces and root lockfile.
3. Set the build command to `npm ci` and the start command to `npm start`.
4. Add `MONGODB_URI` in Render's environment settings using a production database credential. Add `CLIENT_ORIGIN` with the exact deployed frontend origin (scheme and host, no trailing slash). Render supplies `PORT`; do not hard-code a production port.
5. Ensure the MongoDB provider's network access rules permit the Render service to connect. Keep database credentials only in Render environment settings, never in Git.
6. Set the Render health-check path to `/api/health`. Confirm the response reports `status: ok` and, when MongoDB is configured, `database: connected`.

For a separately deployed frontend, configure its build-time `VITE_API_URL` to the Render API base URL ending in `/api`, then rebuild and deploy it. Update `CLIENT_ORIGIN` on the backend to match that frontend's production origin. The API uses CORS to allow only the configured origin(s).
