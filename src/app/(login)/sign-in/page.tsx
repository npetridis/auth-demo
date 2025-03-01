import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import Login from "./SignInForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/session/auth";

export default async function SignInPage() {
  const session = await auth();

  if (session?.isLoggedIn) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <Suspense>
          <Login />
        </Suspense>
      </Card>
    </div>
  );
}
