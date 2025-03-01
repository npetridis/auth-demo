import { Button } from "@/components/ui/button";
import { auth } from "@/lib/session/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <div className="container flex flex-col h-16 items-center justify-self-center">
      <div className="text-center w-full pt-12">
        {JSON.stringify(session, null, 2)}
      </div>
      <div>This is the landing page with a description of the repo</div>

      <Button asChild>
        <Link href={session?.isLoggedIn ? "/posts" : "/sign-in?redirect=posts"}>
          {session?.isLoggedIn ? "View Posts" : "Get started"}
        </Link>
      </Button>
    </div>
  );
}
