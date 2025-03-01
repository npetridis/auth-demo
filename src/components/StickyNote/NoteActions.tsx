import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/app/posts/actions";

interface NoteActionsProps {
  post: {
    id: string;
    title: string;
    content: string;
  };
}

export default function NoteActions({ post }: NoteActionsProps) {
  return (
    <div className="absolute top-2 right-2 flex gap-0.5">
      <Button
        asChild
        variant={"ghost"}
        size={"sm"}
        title="Edit"
        className="px-1 transition-opacity duration-300 opacity-0 group-hover:opacity-70"
      >
        <Link href={`/posts/${post.id}/edit`}>
          <Edit2Icon />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="submit"
            variant={"ghost"}
            size={"sm"}
            title="Delete"
            className="px-1 transition-opacity duration-300 opacity-0 group-hover:opacity-70"
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post with title &quot;
              {post.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deletePost}>
              <input type="hidden" name="postId" value={post.id} />
              <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
