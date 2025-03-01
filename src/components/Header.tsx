import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { auth } from "@/lib/session/auth";
import NavItems from "./NavItems";

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-self-center">
        <Link href={"/"}>
          <div className="flex items-center gap-2 mr-4">
            <div className="h-5 w-5 bg-black" />
            <span className="font-medium">PostBook</span>
          </div>
        </Link>

        <NavItems isLoggedIn={session?.isLoggedIn} />

        <div className="flex items-center gap-4">
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
