"use server";

import { auth } from "@/lib/session/auth";
import { z } from "zod";
import {
  createPost as cretePostQuery,
  deletePost as deletePostQuery,
  getPostsCountByUserId,
  updatePost as updatePostQuery,
} from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string };

const newPostSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters.",
    })
    .max(1000, {
      message: "Content must not exceed 1000 characters.",
    }),
});

export async function createPost(prevState: ActionState, formData: FormData) {
  const parserResult = newPostSchema.safeParse(Object.fromEntries(formData));

  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  const session = await auth();

  if (!session.isLoggedIn || !session.userId) {
    return { error: "You must be logged in to create a post." };
  }

  let postsCount = 0;
  try {
    postsCount = await getPostsCountByUserId(session.userId);
  } catch {
    return { error: "Failed to get user posts. Please try again." };
  }

  if (postsCount >= 50) {
    return { error: "You have reached the maximum number of posts." };
  }

  try {
    await cretePostQuery({
      title: parserResult.data.title,
      content: parserResult.data.content,
      userId: session.userId,
    });
  } catch (_error) {
    console.log("Failed to create post", _error);
    return { error: "Failed to create post. Please try again." };
  }

  redirect("/posts");
}

export async function deletePost(formData: FormData) {
  const postId = formData.get("postId");
  if (!postId) return; // { error: "Post ID is required." };
  try {
    await deletePostQuery(postId as string);
  } catch {
    throw new Error("Failed to delete post");
  }
  revalidatePath("/posts");
}

export async function updatePost(prevState: ActionState, formData: FormData) {
  const parserResult = newPostSchema.safeParse(Object.fromEntries(formData));

  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }
  const postId = formData.get("postId");
  try {
    await updatePostQuery(postId as string, {
      title: parserResult.data.title,
      content: parserResult.data.content,
    });
  } catch {
    return { error: "Failed to update post. Please try again." };
  }
  redirect("/posts");
}
