import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { threads } from "./threads";
import { nanoid } from "@/lib/utils";

export const interactions = pgTable("interactions", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  threadId: varchar("thread_id", { length: 191 })
    .references(() => threads.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 20 }).notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
