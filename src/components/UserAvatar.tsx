import { signOut } from "@/app/(login)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/session/auth";
import { truncateEthAddress } from "@/lib/utils";
import { ExternalLink, Github, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function UserAvatar() {
  const session = await auth();

  const displayName =
    session?.username ||
    session?.email ||
    truncateEthAddress(session?.ethereumAddress);

  if (!session?.isLoggedIn) {
    return (
      <>
        <Link
          href={{
            pathname: "/sign-in",
          }}
        >
          <Button variant="outline" className="hidden md:flex">
            Login
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="default" className="hidden md:flex">
            Sign Up
          </Button>
        </Link>
      </>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className="hidden md:flex bg:none"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted h-10 w-10 rounded-full border-2 border-gray-200">
              <User className="h-16 w-16 color-white" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="overflow-hidden whitespace-nowrap text-ellipsis text-overf">
          Welcome {displayName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup></DropdownMenuGroup>
        <Link
          href="https://github.com/npetridis"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DropdownMenuItem>
            <Github />
            <span>GitHub</span>
            <DropdownMenuShortcut>
              <ExternalLink />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <Button
            variant={"unstyled"}
            className="p-0 h-[unset] justify-start w-full"
          >
            <DropdownMenuItem className="w-full">
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
