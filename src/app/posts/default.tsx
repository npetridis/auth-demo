import { Button } from "@/components/ui/button";
import { getPostsByUserId } from "@/lib/db/queries";
import { auth } from "@/lib/session/auth";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StickyNote, EmptyNote } from "@/components/StickyNote";

const MAX_POSTS = 50;

export default async function PostsPage() {
  const { userId } = await auth();
  const posts = await getPostsByUserId(userId!);
  const maxPostsReached = posts.length >= MAX_POSTS;
  return (
    <div className="container flex flex-col h-16 items-start justify-self-center w-full">
      <div className="w-full flex justify-between mt-6">
        <div className="text-2xl">My Posts ({posts.length})</div>
        {!maxPostsReached && (
          <Button asChild size={"sm"}>
            <Link href="/posts/add-new">
              <span className="mr-2">
                <Plus />
              </span>
              Add Post
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {posts.map((post) => (
          <StickyNote key={post.id} post={post} />
        ))}
        {!maxPostsReached && <EmptyNote />}
      </div>
    </div>
  );
}
