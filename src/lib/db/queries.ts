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
  const insertedUser = await db.insert(usersTable).values(data).returning();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = insertedUser[0];
  return userWithoutPassword;
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function getUserById(id: SelectUser["id"]): Promise<
  Array<{
    id: string;
    username: string | null;
    age: number | null;
    email: string | null;
    ethereumAddress: string | null;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUserByEmail(email: SelectUser["email"]): Promise<
  | {
      id: string;
      username: string | null;
      age: number | null;
      email: string | null;
      passwordHash: string | null;
      ethereumAddress: string | null;
    }
  | undefined
> {
  if (!email) return undefined;
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return users.length > 0 ? users[0] : undefined;
}

export async function getUserByEthereumAddress(
  ethAddress: SelectUser["ethereumAddress"]
): Promise<
  | {
      id: string;
      username: string | null;
      age: number | null;
      email: string | null;
      passwordHash: string | null;
      ethereumAddress: string | null;
    }
  | undefined
> {
  if (!ethAddress) return undefined;
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.ethereumAddress, ethAddress))
    .limit(1);

  return users.length > 0 ? users[0] : undefined;
}

export async function getUsersWithPostsCount(
  page = 1,
  pageSize = 5
): Promise<
  Array<{
    postsCount: number;
    id: string;
    username: string | null;
    age: number | null;
    email: string | null;
    ethereumAddress: string | null;
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

export async function getPostsByUserId(
  userId: SelectUser["id"],
  page = 1,
  pageSize = 50
): Promise<
  Array<{
    id: string;
    title: string;
    content: string;
  }>
> {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
    })
    .from(postsTable)
    .where(eq(postsTable.userId, userId))
    .orderBy(asc(postsTable.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
export async function getPostsCountByUserId(userId: SelectUser["id"]) {
  const result = await db
    .select({
      postsCount: count(postsTable.id),
    })
    .from(postsTable)
    .where(eq(postsTable.userId, userId))
    .limit(1);

  return result[0]?.postsCount ?? 0;
}

export async function getPostById(id: SelectPost["id"]): Promise<
  | {
      id: string;
      title: string;
      content: string;
    }
  | undefined
> {
  const posts = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
    })
    .from(postsTable)
    .where(eq(postsTable.id, id));

  return posts.length > 0 ? posts[0] : undefined;
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}

export async function getPostsForLast24Hours(
  page = 1,
  pageSize = 50
): Promise<
  Array<{
    id: string;
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
  data: { title: SelectPost["title"]; content: SelectPost["content"] }
) {
  await db
    .update(postsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(postsTable.id, id));
}

export async function deletePost(id: SelectPost["id"]) {
  await db.delete(postsTable).where(eq(postsTable.id, id));
}
