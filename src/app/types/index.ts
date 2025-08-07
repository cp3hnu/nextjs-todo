import { tasksTable, usersTable } from "@/app/db/schema";

export type DBUser = typeof usersTable.$inferSelect;

export type DBInsertUser = typeof usersTable.$inferInsert;

export type DBTask = typeof tasksTable.$inferSelect;

export type DBInsertTask = typeof tasksTable.$inferInsert;

export interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
