import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "@/lib/utils";
import { threads } from "./threads";

export const pdfs = pgTable("pdfs", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  threadId: varchar("thread_id", { length: 191 })
    .references(() => threads.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
