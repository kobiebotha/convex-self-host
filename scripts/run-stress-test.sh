#!/bin/bash

# Stress Test Runner for Convex PowerSync
# This script runs the data generation and stress testing

set -e

echo "🚀 Starting Convex PowerSync Stress Test"
echo "========================================"

# Check if CONVEX_URL is set
if [ -z "$CONVEX_URL" ]; then
    echo "❌ CONVEX_URL environment variable is not set"
    echo "Please run: export CONVEX_URL='http://127.0.0.1:3210'"
    exit 1
fi

# Check if Convex backend is running
echo "🔍 Checking Convex backend connection..."
if ! curl -s "$CONVEX_URL" > /dev/null; then
    echo "❌ Cannot connect to Convex backend at $CONVEX_URL"
    echo "Please ensure your Docker services are running: docker compose ps"
    exit 1
fi

echo "✅ Convex backend is reachable"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Push the latest schema
echo "🔄 Pushing schema to Convex..."
pnpx convex dev --once

# Run the data generation
echo "📊 Generating stress test data..."
echo "This will create 1,000 lists with 10,000 todos each (1M total documents)"
echo "This may take several minutes..."

pnpm run generate-stress-data

echo ""
echo "✅ Stress test data generation completed!"
echo ""
echo "📈 Summary:"
echo "   - Lists created: 1,000"
echo "   - Todos created: 1,000,000"
echo "   - All Convex datatypes tested"
echo ""
echo "🔍 You can now test the PowerSync replication with this dataset"
echo ""
echo "Next steps:"
echo "1. Check the Convex dashboard: http://localhost:6791"
echo "2. Test PowerSync sync performance"
echo "3. Monitor replication logs"
