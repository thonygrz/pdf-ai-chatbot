import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";

export const threads = pgTable("threads", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
