import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

async function testBatchInsert() {
  const client = new ConvexHttpClient(process.env.CONVEX_URL!);
  
  console.log("Testing batch insert performance...");
  
  // First create a test list
  const listId = await client.mutation(api.lists.create, {
    name: "Batch Test List",
    owner_id: "test_user",
  });
  
  console.log("Created test list:", listId);
  
  // Create test todos in a batch
  const testTodos = [];
  for (let i = 0; i < 100; i++) {
    testTodos.push({
      list_id: listId,
      title: `Test Todo ${i + 1}`,
      description: `Description for test todo ${i + 1}`,
      priority: 1,
      is_urgent: false,
      is_private: false,
      tags: ["test"],
      status: "pending" as const,
      created_by: "test_user",
    });
  }
  
  console.log("Inserting 100 todos in batch...");
  const startTime = Date.now();
  
  const insertedIds = await client.mutation(api.todos.createBatch, { todos: testTodos });
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`✅ Batch insert completed in ${duration}ms`);
  console.log(`✅ Inserted ${insertedIds.length} todos`);
  console.log(`✅ Rate: ${(insertedIds.length / duration * 1000).toFixed(0)} todos/second`);
  
  // Test individual insert for comparison
  console.log("\nTesting individual insert for comparison...");
  const individualStartTime = Date.now();
  
  const individualId = await client.mutation(api.todos.create, {
    list_id: listId,
    title: "Individual Test Todo",
    description: "Description for individual test todo",
    priority: 1,
    is_urgent: false,
    is_private: false,
    tags: ["test"],
    status: "pending" as const,
    created_by: "test_user",
  });
  
  const individualEndTime = Date.now();
  const individualDuration = individualEndTime - individualStartTime;
  
  console.log(`✅ Individual insert completed in ${individualDuration}ms`);
  console.log(`✅ Batch is ${Math.round(individualDuration / (duration / 100))}x faster`);
}

if (!process.env.CONVEX_URL) {
  console.error("CONVEX_URL environment variable is not set");
  process.exit(1);
}

testBatchInsert().catch(console.error);
