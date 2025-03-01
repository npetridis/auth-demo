import { getPostById } from "@/lib/db/queries";
import PostFormModal from "../../PostForm";

export default async function EditPostModal({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  if (!postId) return null;

  const post = await getPostById(postId);
  if (!post) return null;

  return <PostFormModal mode="edit" post={post} />;
}
