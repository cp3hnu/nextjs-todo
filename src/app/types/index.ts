import { tasksTable, usersTable } from "@app/db/schema";

export type DBUser = typeof usersTable.$inferSelect;

export type DBTask = typeof tasksTable.$inferSelect;

export interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
