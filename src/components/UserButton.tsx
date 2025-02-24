import { auth } from "@/lib/session/auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut } from "@/app/(login)/actions";
import { truncateEthAddress } from "@/lib/utils";

export default async function UserButton() {
  const session = await auth();

  if (!session?.isLoggedIn) {
    return (
      <Link href="/sign-in">
        <Button variant={"secondary"}>Sign In</Button>
      </Link>
    );
  }

  return (
    <div className="flex flex-col justify-end gap-4">
      <div className="text-white">
        {session?.email || truncateEthAddress(session?.ethereumAddress)}
      </div>
      <form action={signOut}>
        <Button type="submit" variant={"secondary"}>
          Sign Out
        </Button>
      </form>
    </div>
  );
}
