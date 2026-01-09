import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ---------- ENUM ---------- */
/* ---------- ENUM ---------- */
/* ---------- ENUM ---------- */

export const uploadStatusEnum = pgEnum("upload_status", [
  "pending",
  "success",
  "failed",
]);

/* ---------- TABLE ---------- */
/* ---------- TABLE ---------- */
/* ---------- TABLE ---------- */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    username: text("username").notNull(),
    password: text("password").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },

  (t) => ({
    providerUnique: uniqueIndex("username_uidx").on(t.username),
  })
);

export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  parentFolderId: uuid("parent_folder_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// folders 자기 참조 관계
export const folderRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentFolderId],
    references: [folders.id],
  }),

  children: many(folders),
}));

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),

  share: boolean("share").default(false).notNull(),

  // 업로드가 덜 끝났을 때
  uploadStatus: uploadStatusEnum("upload_status").default("pending").notNull(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
