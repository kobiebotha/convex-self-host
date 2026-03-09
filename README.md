# Convex Self-Hosted

A self-hosted [Convex](https://www.convex.dev) backend running via Docker.

## Prerequisites

- Docker and Docker Compose
- Node.js (for the Convex CLI)

## Services

| Service   | URL                        | Description                    |
|-----------|----------------------------|--------------------------------|
| Backend   | http://127.0.0.1:3210      | Convex database & functions    |
| HTTP Actions | http://127.0.0.1:3211   | HTTP action endpoints          |
| Dashboard | http://localhost:6791      | Convex admin dashboard         |

## Quick Start

### 1. Start the services

```bash
docker compose up -d
```

### 2. Generate an admin key

```bash
docker compose exec backend ./generate_admin_key.sh
```

Copy the generated key and add it to `.env.local`:

```bash
CONVEX_SELF_HOSTED_URL='http://127.0.0.1:3210'
CONVEX_SELF_HOSTED_ADMIN_KEY='<your-admin-key>'
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up Convex functions and environment

Run the setup script to push functions and configure Convex env vars:

```bash
npm run setup
```

This pushes your Convex functions and sets `JWT_PRIVATE_KEY` (a PKCS#8 PEM RSA private key required by Convex Auth). If `CONVEX_JWT_PRIVATE_KEY` is not already present in `.env.local`, the script generates one automatically and appends it.

For ongoing development, use watch mode:

```bash
npm run dev
```

## Common Commands

```bash
# Start services in background
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Generate a new admin key
docker compose exec backend ./generate_admin_key.sh

# Push code changes (watch mode)
npx convex dev

# Push code once
npx convex dev --once

# See all Convex CLI commands
npx convex --help
```

## Configuration

### Environment Variables

The backend supports various environment variables for advanced configuration:

- `POSTGRES_URL` / `MYSQL_URL` - Use external database instead of SQLite
- `S3_STORAGE_*` - Configure S3 storage for files, exports, etc.
- `INSTANCE_SECRET` - Custom instance secret
- `RUST_LOG` - Log level (default: `info`)

See the [official documentation](https://github.com/get-convex/convex-backend/tree/main/self-hosted) for more options.

### Persistent Storage

Data is stored in a Docker volume (`data`). For production deployments, ensure proper backup strategies are in place.

## Authentication

This project uses [Convex Auth](https://labs.convex.dev/auth) with the Password provider for user authentication.

### Required Environment Variables

The following Convex deployment env var is set automatically by `npm run setup`:

| Convex Env Var | Source in `.env.local` | Description |
|---|---|---|
| `JWT_PRIVATE_KEY` | `CONVEX_JWT_PRIVATE_KEY` | Secret key used by Convex Auth to sign JWTs |

To manage Convex env vars manually:

```bash
npx convex env set JWT_PRIVATE_KEY "<value>"
npx convex env list
```

## PowerSync Integration

This project includes Convex HTTP actions that serve as the backend for the PowerSync demo app, eliminating the need for a separate Node.js backend.

### Endpoints (served at http://127.0.0.1:3211)

| Endpoint | Method | Description |
|---|---|---|
| `/auth/token` | GET | Returns a signed JWT for PowerSync authentication (uses Convex Auth session) |
| `/auth/keys` | GET | JWKS endpoint for PowerSync to verify tokens |
| `/powersync/batch` | POST | Accepts CRUD mutations from the PowerSync client SDK |

### Configure PowerSync Service

Point the PowerSync service's JWKS URL at the Convex HTTP action:

```yaml
client_auth:
  jwks_uri: http://127.0.0.1:3211/auth/keys
```

## Project Structure

```
convex-self-host/
├── .env.local           # Credentials (do not commit!)
├── .gitignore
├── convex/              # Your Convex functions
├── docker-compose.yml   # Service definitions
├── scripts/
│   ├── setup-env.mjs    # Sets Convex env vars from .env.local
│   └── generate-keys.mjs
├── package.json
└── README.md
```

## Resources

- [Convex Self-Hosting Guide](https://github.com/get-convex/convex-backend/tree/main/self-hosted)
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Discord (#self-hosted)](https://discord.gg/convex)
