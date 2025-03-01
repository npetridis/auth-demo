"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signUp } from "../actions";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [state, signUpAction, pending] = useActionState(signUp, { error: "" });
  return (
    <form action={signUpAction}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="joe@example.com"
            type="email"
            required
          />
        </div>
        <div className="space-y-2">
          <input type="hidden" name="redirect" value={redirect || ""} />

          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Joe"
            type="text"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {state.error && (
          <div className="text-red-500 text-sm mb-4">{state.error}</div>
        )}
        <Button type="submit" className="w-full">
          {pending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
        <div className="w-full text-right pt-2">
          <Link href="/sign-in" className="hover:underline text-sm">
            already have an account?
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}
