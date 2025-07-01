import { integer, pgTable, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});

export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  completed: boolean().default(false),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});
