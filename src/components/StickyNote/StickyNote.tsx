import NoteActions from "./NoteActions";

interface StickyNoteProps {
  post: { id: string; title: string; content: string };
}

export function StickyNote({ post }: StickyNoteProps) {
  return (
    <div className="w-[308px] p-6 relative group hover:-translate-y-1 transition-transform">
      {/* Note background with shadow effect */}
      <div className="absolute inset-0 bg-white shadow-lg rounded-sm transform transition-shadow duration-200 group-hover:shadow-xl" />

      {/* Content container */}
      <div className="relative">
        <h3 className="font-handwriting text-xl mb-3 text-gray-800 line-clamp-2">
          {post.title}
        </h3>
        <p className="font-handwriting text-sm text-gray-700 line-clamp-6">
          {post.content}
        </p>
      </div>
      <NoteActions post={post} />
    </div>
  );
}
