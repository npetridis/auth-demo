"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
];

export default function NavItems({
  isLoggedIn = false,
}: {
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-1 justify-center">
      <ul className="flex gap-8">
        {isLoggedIn &&
          menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-md transition-colors hover:text-purple-700",
                  pathname === item.href
                    ? "text-purple-500"
                    : "text-secondary-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
