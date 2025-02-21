import { auth, signOut } from "@/auth";

import { Button } from "./ui/button";
import Link from "next/link";

export default async function UserButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/sign-in">
        <Button variant={"secondary"}>Sign In</Button>
      </Link>
    );
  }

  return (
    <div className="flex flex-col justify-end gap-4">
      <div className="text-white">{session?.user?.email}</div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button variant={"secondary"}>Sign Out</Button>
      </form>
    </div>
  );
}
