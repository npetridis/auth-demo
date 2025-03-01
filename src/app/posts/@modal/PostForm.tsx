"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost, updatePost } from "../actions";
import { Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";

export default function PostFormModal({
  mode = "create",
  post,
}: {
  mode?: "create" | "edit";
  post?: { id: string; title: string; content: string };
}) {
  const router = useRouter();
  const [state, postAction, pending] = useActionState(
    mode === "create" ? createPost : updatePost,
    {
      error: "",
    }
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) router.push("/posts");
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Post" : "Edit Post"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new post. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={postAction} className="space-y-4">
          <input type="hidden" name="postId" value={post?.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter post title"
              defaultValue={post?.title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content" className="text-sm">
              Content
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your post content here..."
              className="min-h-[120px]"
              defaultValue={post?.content}
            />
          </div>
          {state.error && (
            <div className="text-red-500 text-sm mb-4">{state.error}</div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Save Post"
              ) : (
                "Edit Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
