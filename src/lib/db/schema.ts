import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users_table",
  {
    id: serial("id").primaryKey(),
    username: text("username"),
    age: integer("age"),
    // Store bcrypt-hashed password (bcrypt hashes are typically 60 chars long).
    passwordHash: varchar("password_hash", { length: 60 }),
    email: text("email"),
    ethereumAddress: varchar("ethereum_address", { length: 42 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Create unique indexes for email and ethereum_address
      emailUniqueIndex: uniqueIndex("users_email_unique").on(table.email),
      ethAddressUniqueIndex: uniqueIndex("users_eth_addr_unique").on(
        table.ethereumAddress
      ),
    };
  }
);

export const postsTable = pgTable("posts_table", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
