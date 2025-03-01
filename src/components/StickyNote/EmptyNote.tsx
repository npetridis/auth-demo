import { Plus } from "lucide-react";
import Link from "next/link";

export function EmptyNote() {
  return (
    <Link href={"/posts/add-new"}>
      <div className="w-[308px] p-6 relative group cursor-pointer hover:-translate-y-1 transition-all">
        {/* Note background with dashed border */}
        <div className="absolute inset-0 bg-purple-50 border-2 border-dashed border-purple-200 rounded-sm transform transition-all duration-200 group-hover:shadow-lg group-hover:border-purple-300" />

        {/* Content container */}
        <div className="relative min-h-[120px] flex flex-col items-center justify-center text-purple-400 group-hover:text-purple-500 transition-colors">
          <Plus size={24} className="mb-2" />
          <p className="font-handwriting text-sm">Create New Note</p>
        </div>
      </div>
    </Link>
  );
}
