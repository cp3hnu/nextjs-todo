import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { DBTask, DBUser } from "@/app/types";
import { tasksTable, usersTable } from "./schema";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
});

export default db;

export async function dbInsertUser(username: string, email: string, password: string): Promise<DBUser> {
  try {
    const user: typeof usersTable.$inferInsert = {
      username,
      email,
      password,
    };
    const result = await db.insert(usersTable).values(user);
    return result[0];
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

export async function dbGetUserById(id: number): Promise<DBUser> {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return users[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

export async function dbGetUserByUsername(username: string): Promise<DBUser> {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return users[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
}

export async function dbGetUserByEmail(email: string): Promise<DBUser> {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return users[0];
  } catch (error) {
    console.error("Error fetching user by username or email:", error);
    throw error;
  }
}

export async function dbInsertTask(userId: number, title: string): Promise<DBTask> {
  try {
    const task: typeof tasksTable.$inferInsert = {
      userId,
      title,
    };
    const result = await db.insert(tasksTable).values(task).returning();
    return result[0];
  } catch (error) {
    console.error("Error inserting task:", error);
    throw error;
  }
}

export async function dbGetTasks(userId: number, title?: string): Promise<DBTask[]> {
  try {
    const filters = [eq(tasksTable.userId, userId)];
    if (title) {
      filters.push(ilike(tasksTable.title, `%${title}%`));
    }

    const result = await db
      .select()
      .from(tasksTable)
      .where(and(...filters))
      .orderBy(
        desc(tasksTable.completed),
        // CASE WHEN completed THEN updated_at END DESC
        sql`CASE WHEN ${tasksTable.completed} THEN ${tasksTable.updatedAt} END DESC`,
        // CASE WHEN NOT completed THEN created_at END ASC
        sql`CASE WHEN NOT ${tasksTable.completed} THEN ${tasksTable.createdAt} END ASC`,
      );

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error fetching tasks by user ID:", error);
    throw error;
  }
}

export async function dbUpdateTask(taskId: number, updates: { title?: string; completed?: boolean }): Promise<DBTask> {
  const dbUpdates = {
    ...updates,
    updatedAt: new Date(),
  };
  try {
    const result = await db.update(tasksTable).set(dbUpdates).where(eq(tasksTable.id, taskId)).returning();
    return result[0];
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function dbDeleteTask(taskId: number): Promise<number> {
  try {
    await db.delete(tasksTable).where(eq(tasksTable.id, taskId)).returning();
    return taskId;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
