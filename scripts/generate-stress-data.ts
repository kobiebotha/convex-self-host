import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { Id } from "convex/dataModel";

// Configuration
const NUM_LISTS = 1000;
const TODOS_PER_LIST = 1000;
const BATCH_SIZE = 5000; // Large batch size for maximum performance

// Sample data for realistic stress testing
const CATEGORIES = ["work", "personal", "shopping", "health", "education", "finance", "home", "travel"];
const TAGS = ["urgent", "important", "review", "follow-up", "waiting", "delegated", "someday", "recurring"];
const USERS = Array.from({ length: 100 }, (_, i) => `user_${i + 1}`);
const STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

// Random data generators
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateMetadata() {
  return {
    created_version: randomFloat(1.0, 3.0),
    last_modified: new Date(Date.now() - randomNumber(0, 86400000)).toISOString(),
    source: randomChoice(["web", "mobile", "api", "import"]),
    batch_id: randomString(8),
    priority_score: randomNumber(1, 100),
  };
}

function generateCustomFields() {
  const fields: Record<string, string | number | boolean> = {};
  const fieldNames = ["budget", "location", "deadline", "approval", "risk_level"];
  
  for (const name of fieldNames) {
    if (Math.random() > 0.3) {
      switch (name) {
        case "budget":
          fields[name] = randomNumber(100, 10000);
          break;
        case "location":
          fields[name] = randomChoice(["remote", "office", "hybrid", "client-site"]);
          break;
        case "deadline":
          fields[name] = new Date(Date.now() + randomNumber(0, 7776000000)).toISOString().split('T')[0];
          break;
        case "approval":
          fields[name] = Math.random() > 0.5;
          break;
        case "risk_level":
          fields[name] = randomChoice(["low", "medium", "high"]);
          break;
      }
    }
  }
  
  return Object.keys(fields).length > 0 ? fields : undefined;
}

function generateTodo(listId: Id<"lists">, index: number, allTodoIds: Id<"todos">[]) {
  const now = new Date();
  const createdDate = new Date(now.getTime() - randomNumber(0, 7776000000)); // Random time in last 90 days
  
  return {
    list_id: listId,
    title: `Task ${index + 1}: ${randomChoice(["Implement", "Review", "Fix", "Design", "Test", "Deploy", "Document", "Optimize"])} ${randomChoice(["API", "UI", "Database", "Security", "Performance", "Feature", "Bug", "Integration"])}`,
    description: `Detailed description for task ${index + 1}. This task involves ${randomChoice(["coding", "analysis", "testing", "documentation", "planning", "communication"])} and requires attention to detail.`,
    notes: Math.random() > 0.7 ? `Additional notes for task ${index + 1}. ${randomString(randomNumber(20, 100))}` : undefined,
    category: randomChoice(CATEGORIES),
    
    // Numbers
    priority: randomNumber(1, 5),
    estimated_hours: Math.random() > 0.5 ? randomFloat(0.5, 40) : undefined,
    progress_percentage: Math.random() > 0.3 ? randomFloat(0, 100) : undefined,
    
    // Booleans
    is_urgent: Math.random() > 0.8,
    is_private: Math.random() > 0.9,
    has_attachments: Math.random() > 0.6,
    
    // Arrays
    tags: randomChoices(TAGS, randomNumber(1, 4)),
    assigned_users: Math.random() > 0.5 ? randomChoices(USERS, randomNumber(1, 3)) : undefined,
    
    // Objects
    metadata: generateMetadata(),
    custom_fields: generateCustomFields(),
    
    // ID references
    parent_task_id: Math.random() > 0.9 && index > 0 ? randomChoice(allTodoIds.slice(-10)) : undefined,
    
    // Unions
    status: randomChoice(STATUSES),
    difficulty: Math.random() > 0.4 ? randomChoice(DIFFICULTIES) : undefined,
    
    // Null handling
    archived_at: Math.random() > 0.95 ? new Date(Date.now() - randomNumber(0, 7776000000)).toISOString() : undefined,
    deleted_by: Math.random() > 0.98 ? randomChoice(USERS) : undefined,
    
    // Legacy fields
    completed: Math.random() > 0.7 ? 1 : 0,
    created_by: randomChoice(USERS),
    completed_by: Math.random() > 0.6 ? randomChoice(USERS) : null,
    photo_id: Math.random() > 0.8 ? `photo_${randomString(12)}` : null,
    owner_id: randomChoice(USERS),
    
    // Timestamps
    created_at: createdDate.toISOString(),
    completed_at: Math.random() > 0.6 ? new Date(createdDate.getTime() + randomNumber(3600000, 7776000000)).toISOString() : undefined,
  };
}

async function generateLists(client: ConvexHttpClient): Promise<Id<"lists">[]> {
  console.log(`Generating ${NUM_LISTS} lists...`);
  const listIds: Id<"lists">[] = [];
  
  for (let i = 0; i < NUM_LISTS; i++) {
    const list = await client.mutation(api.lists.create, {
      name: `List ${i + 1}: ${randomChoice(["Project", "Sprint", "Epic", "Initiative", "Campaign", "Release"])} ${randomChoice(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"])}`,
      owner_id: randomChoice(USERS),
      source_id: `source_list_${i + 1}`,
      created_at: new Date(Date.now() - randomNumber(0, 7776000000)).toISOString(),
      archived: Math.random() > 0.9 ? 1 : 0,
    });
    
    listIds.push(list);
    
    if ((i + 1) % 100 === 0) {
      console.log(`Created ${i + 1}/${NUM_LISTS} lists`);
    }
  }
  
  return listIds;
}

async function generateTodos(client: ConvexHttpClient, listIds: Id<"lists">[]) {
  console.log(`Generating ${NUM_LISTS * TODOS_PER_LIST} todos...`);
  let totalTodos = 0;
  
  for (let listIndex = 0; listIndex < listIds.length; listIndex++) {
    const listId = listIds[listIndex];
    const todoIds: Id<"todos">[] = [];
    
    // Generate todos in batches for this list
    for (let batchStart = 0; batchStart < TODOS_PER_LIST; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, TODOS_PER_LIST);
      const batchTodos: any[] = [];
      
      for (let i = batchStart; i < batchEnd; i++) {
        const todo = generateTodo(listId, i, todoIds);
        batchTodos.push(todo);
      }
      
      // Insert entire batch in one API call
      const insertedIds = await client.mutation(api.todos.createBatch, { todos: batchTodos });
      todoIds.push(...insertedIds);
      totalTodos += batchTodos.length;
      
      if (totalTodos % 50000 === 0) {
        console.log(`Created ${totalTodos}/${NUM_LISTS * TODOS_PER_LIST} todos`);
      }
    }
    
    if ((listIndex + 1) % 100 === 0) {
      console.log(`Completed list ${listIndex + 1}/${NUM_LISTS}`);
    }
  }
  
  console.log(`Finished generating ${totalTodos} todos`);
}

async function main() {
  const client = new ConvexHttpClient(process.env.CONVEX_URL!);
  
  console.log("Starting stress test data generation...");
  console.log(`Target: ${NUM_LISTS} lists with ${TODOS_PER_LIST} todos each (${NUM_LISTS * TODOS_PER_LIST} total todos)`);
  
  const startTime = Date.now();
  
  try {
    // Generate lists first
    const listIds = await generateLists(client);
    
    // Then generate todos for all lists
    await generateTodos(client, listIds);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\nData generation completed in ${duration.toFixed(2)} seconds`);
    console.log(`Generated ${NUM_LISTS} lists and ${NUM_LISTS * TODOS_PER_LIST} todos`);
    console.log(`Average rate: ${((NUM_LISTS * TODOS_PER_LIST) / duration).toFixed(0)} todos/second`);
    
  } catch (error) {
    console.error("Error during data generation:", error);
    process.exit(1);
  }
}

// Check if CONVEX_URL is set
if (!process.env.CONVEX_URL) {
  console.error("CONVEX_URL environment variable is not set");
  console.error("Please set it to your Convex deployment URL");
  process.exit(1);
}

main().catch(console.error);
