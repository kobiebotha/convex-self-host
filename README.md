# This repo is AI generated.

Prompt: `self host convex in this folder using the self-host guide here https://docs.convex.dev/self-hosting`

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

### 4. Push your Convex functions

```bash
npx convex dev
```

## Common Commands

```bash
# seed 2000 records
npx convex run seed:seedLists '{"count": 2000}'

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

## Project Structure

```
convex-self-host/
├── .env.local           # Credentials (do not commit!)
├── .gitignore
├── convex/              # Your Convex functions
├── docker-compose.yml   # Service definitions
├── package.json
└── README.md
```

## Resources

- [Convex Self-Hosting Guide](https://github.com/get-convex/convex-backend/tree/main/self-hosted)
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Discord (#self-hosted)](https://discord.gg/convex)
