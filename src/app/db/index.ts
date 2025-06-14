import postgres from "postgres";
import { DBTask, DBUser } from "@app/types";
// const sql = postgres({
//   host: "localhost",
//   port: 5432,
//   database: "mydb",
//   username: "cp3hnu",
//   password: "zwpsq"
// });

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "mydb",
  username: process.env.DB_USER || "cp3hnu",
  password: process.env.DB_PASSWORD || "zwpsq"
});

export default sql;

// create user table
export async function createUserTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
// create todo table
export async function createTaskTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
// Initialize the database
export async function initializeDatabase() {
  try {
    await createUserTable();
    await createTaskTable();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function dbInsertUser(
  username: string,
  email: string,
  password: string
): Promise<DBUser> {
  try {
    const result = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${password})
      RETURNING *
    `;
    return result[0] as DBUser;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

export async function dbGetUserByUsername(username: string): Promise<DBUser> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return result[0] as DBUser;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
}

export async function dbInsertTask(
  userId: number,
  title: string
): Promise<DBTask> {
  try {
    const result = await sql`
      INSERT INTO tasks (user_id, title)
      VALUES (${userId}, ${title})
      RETURNING *
    `;
    return result[0] as DBTask;
  } catch (error) {
    console.error("Error inserting task:", error);
    throw error;
  }
}

export async function dbGetTasks(
  userId: number,
  title?: string
): Promise<DBTask[]> {
  try {
    const titleQuery = title ? sql`AND title ILIKE ${`%${title}%`}` : sql``;
    const result = await sql`
      SELECT * FROM tasks WHERE user_id = ${userId} ${titleQuery}
    `;
    console.log("Fetched tasks:", title, result);

    return result as unknown as DBTask[];
  } catch (error) {
    console.error("Error fetching tasks by user ID:", error);
    throw error;
  }
}

export async function dbUpdateTask(
  taskId: number,
  updates: { title?: string; completed?: boolean }
): Promise<DBTask> {
  try {
    const result = await sql`
      UPDATE tasks
      SET ${sql(updates)}
      WHERE id = ${taskId}
      RETURNING *
    `;
    return result[0] as DBTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function dbDeleteTask(taskId: number): Promise<number> {
  try {
    await sql`
      DELETE FROM tasks WHERE id = ${taskId}
    `;
    return taskId;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
