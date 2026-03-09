# Convex PowerSync Stress Test

This stress test is designed to validate PowerSync replication performance with 1M documents across all supported Convex datatypes.

## Overview

- **Target**: 1,000 lists with 10,000 todos each (1M total documents)
- **Datatypes Tested**: All Convex supported types including strings, numbers, booleans, arrays, objects, IDs, unions, and null values
- **Realistic Data**: Uses realistic patterns with relationships, metadata, and varied data distributions

## Schema Extensions

The `todos` table has been extended to include:

### Basic Types
- **Strings**: title, notes, category
- **Numbers**: priority, estimated_hours (float64), progress_percentage (float64)
- **Booleans**: is_urgent, is_private, has_attachments

### Complex Types
- **Arrays**: tags, dependencies (ID references), assigned_users
- **Objects**: metadata (any values), custom_fields (typed records)
- **ID References**: parent_task_id, project_id

### Advanced Types
- **Unions**: status (literal values), difficulty (optional literals)
- **Null Handling**: archived_at, deleted_by (nullable strings)
- **Legacy Fields**: Maintained for backwards compatibility

## Quick Start

### Prerequisites

1. Ensure Convex self-hosted backend is running:
   ```bash
   docker compose ps
   ```

2. Set environment variables:
   ```bash
   export CONVEX_URL='http://127.0.0.1:3210'
   ```

### Running the Stress Test

#### Option 1: Automated Script
```bash
pnpm run run-stress-test
```

#### Option 2: Manual Steps
```bash
# 1. Push schema updates
pnpx convex dev --once

# 2. Generate test data
pnpm run generate-stress-data
```

## What Gets Generated

### Lists (1,000 total)
- Random names with project/sprint patterns
- Random owners from 100 simulated users
- Optional archival status
- Source IDs for PowerSync tracking

### Todos (10,000 per list, 1M total)
- **Realistic titles**: Task descriptions with action + target patterns
- **Varied priorities**: 1-5 scale
- **Random metadata**: Version numbers, timestamps, sources
- **Custom fields**: Budget, location, deadline, approval, risk level
- **Relationships**: Parent-child links, project references
- **Arrays**: Tags (1-4 per todo), assigned users, dependencies
- **Status distribution**: Random across pending/in_progress/completed/cancelled
- **Temporal data**: Created dates over last 90 days, completion times

## Performance Monitoring

### During Generation
The script provides real-time progress:
```
Created 100/1000 lists
Created 10000/1000000 todos
Completed list 100/1000
```

### After Generation
- **Convex Dashboard**: http://localhost:6791
- **Document Counts**: Verify 1,000 lists, 1M todos
- **Index Performance**: Check query speeds on new indexes

## Testing PowerSync Replication

After data generation, test PowerSync replication:

1. **Initial Sync**: Measure time to sync all 1M documents
2. **Incremental Updates**: Test performance with real-time changes
3. **Query Performance**: Validate filtered queries work efficiently
4. **Memory Usage**: Monitor client memory during large syncs

## Customization

### Adjusting Scale
Edit `scripts/generate-stress-data.ts`:
```typescript
const NUM_LISTS = 1000;        // Change this
const TODOS_PER_LIST = 10000;  // Change this
```

### Data Patterns
Modify the generator functions to test different:
- Data distributions
- Relationship patterns
- Field usage frequencies

## Troubleshooting

### Connection Issues
```bash
# Check backend status
docker compose ps
docker compose logs backend

# Verify URL
curl $CONVEX_URL
```

### Performance Issues
- Reduce `BATCH_SIZE` if overwhelmed
- Check Convex dashboard for errors
- Monitor system resources

### Schema Errors
```bash
# Re-push schema
pnpx convex dev --once
```

## Expected Results

- **Generation Time**: 5-15 minutes (depends on system)
- **Storage**: ~500MB-1GB (varies with data patterns)
- **Memory**: Moderate during generation, low after
- **Indexes**: 5 new indexes for query optimization

This stress test provides a comprehensive dataset for validating PowerSync's ability to handle large-scale, complex data replication scenarios.
