import { asc, between, count, eq, getTableColumns, sql } from "drizzle-orm";
import {
  InsertPost,
  InsertUser,
  postsTable,
  SelectPost,
  SelectUser,
  usersTable,
} from "./schema";
import { db } from "./drizzle";

/** User queries */

export async function createUser(data: InsertUser) {
  return await db.insert(usersTable).values(data).returning();
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function getUserById(id: SelectUser["id"]): Promise<
  Array<{
    id: number;
    username: string;
    age: number;
    email: string;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUserByEmail(email: SelectUser["email"]): Promise<
  | {
      id: number;
      username: string;
      age: number;
      email: string;
      passwordHash: string;
    }
  | undefined
> {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return users.length > 0 ? users[0] : undefined;
}

export async function getUsersWithPostsCount(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    postsCount: number;
    id: number;
    username: string;
    age: number;
    email: string;
  }>
> {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

/** Post queries */

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}

export async function getPostsForLast24Hours(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    id: number;
    title: string;
  }>
> {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(
      between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`)
    )
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function updatePost(
  id: SelectPost["id"],
  data: Partial<Omit<SelectPost, "id">>
) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}

export async function deletePost(id: SelectPost["id"]) {
  await db.delete(postsTable).where(eq(postsTable.id, id));
}
