# Agent Context

This document provides context for AI agents working on this Convex self-hosted project.

## Project Overview

This is a self-hosted Convex backend running locally via Docker. It provides a real-time database and serverless functions platform without relying on Convex's cloud service.

## Setup Steps Performed

1. **Downloaded docker-compose.yml** from the official Convex self-hosting repository:
   ```bash
   curl -o docker-compose.yml https://raw.githubusercontent.com/get-convex/convex-backend/main/self-hosted/docker/docker-compose.yml
   ```

2. **Started Docker services**:
   ```bash
   docker compose up -d
   ```

3. **Generated admin key**:
   ```bash
   docker compose exec backend ./generate_admin_key.sh
   ```

4. **Created `.env.local`** with credentials:
   ```
   CONVEX_SELF_HOSTED_URL='http://127.0.0.1:3210'
   CONVEX_SELF_HOSTED_ADMIN_KEY='<generated-key>'
   ```

5. **Initialized npm project and installed Convex**:
   ```bash
   npm init -y
   npm install convex@latest
   ```

6. **Connected to self-hosted backend**:
   ```bash
   npx convex dev --once
   ```

## Key Information

### Service Endpoints

- **Backend API**: `http://127.0.0.1:3210`
- **HTTP Actions**: `http://127.0.0.1:3211`
- **Dashboard**: `http://localhost:6791`

### Credentials Location

Credentials are stored in `.env.local` (not committed to git):
- `CONVEX_SELF_HOSTED_URL` - Backend URL
- `CONVEX_SELF_HOSTED_ADMIN_KEY` - Admin authentication key
- `CONVEX_URL` - Same as backend URL (set by Convex CLI)
- `CONVEX_SITE_URL` - HTTP actions URL (set by Convex CLI)

### Generating New Admin Keys

Admin keys can be regenerated at any time:
```bash
docker compose exec backend ./generate_admin_key.sh
```

Update `.env.local` with the new key after generation.

## Working with Convex Functions

### Creating Functions

Add functions in the `convex/` directory. Example query:

```typescript
// convex/tasks.ts
import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```

### Pushing Changes

```bash
# Watch mode (auto-push on save)
npx convex dev

# One-time push
npx convex dev --once
```

### Schema Definition

Define your schema in `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
});
```

## Common Tasks

### Check if services are running
```bash
docker compose ps
```

### View logs
```bash
docker compose logs -f
```

### Restart services
```bash
docker compose restart
```

### Stop services
```bash
docker compose down
```

### Complete reset (removes data)
```bash
docker compose down -v
```

## Troubleshooting

### Backend not healthy
Check logs: `docker compose logs backend`

### Authentication errors
Regenerate admin key and update `.env.local`

### Connection refused
Ensure Docker services are running: `docker compose ps`

## References

- [Official Self-Hosting Guide](https://github.com/get-convex/convex-backend/tree/main/self-hosted)
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth Setup (Manual)](https://labs.convex.dev/auth/setup/manual)
