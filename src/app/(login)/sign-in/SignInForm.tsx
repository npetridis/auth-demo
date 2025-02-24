"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { ethereumSignIn, signIn } from "../actions";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { SiweMessage } from "siwe";
// import { signIn as authSignIn } from "@/auth";

export default function SignInForm() {
  const [state, signInAction, pending] = useActionState(signIn, { error: "" });
  // const [ethState, ethSignInAction, ethPending] = useActionState(ethereumSignIn, { error: "" });

  async function handleEthSignIn() {
    try {
      // setLoading(true);

      // 1. Connect wallet with viem
      if (!window.ethereum) {
        alert("No crypto wallet found. Please install it.");
        return;
      }

      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });
      const addresses = await walletClient.requestAddresses();

      if (!addresses || !addresses[0]) {
        throw new Error("No accounts returned from wallet.");
      }
      const address = addresses[0];

      // 2. Construct SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum",
        uri: window.location.origin,
        version: "1",
        chainId: await walletClient.getChainId(),
        // Possibly also a nonce, expirationTime, etc.
      });
      const message = siweMessage.prepareMessage();

      // 3. Sign message
      const signature = await walletClient.signMessage({
        account: address,
        message,
      });

      // 4. Send to NextAuth Credentials Provider
      const formData = new FormData();
      formData.append("message", JSON.stringify(siweMessage));
      formData.append("signature", signature);
      const r = await ethereumSignIn({ error: "" }, formData);
      console.log("result", r);
      // const res = await authSignIn("ethereum", {
      //   message: JSON.stringify(siweMessage),
      //   signature,
      //   redirect: false,
      // });
      // if (res?.error) {
      //   console.error("SIWE login error:", res.error);
      // } else {
      //   window.location.href = "/dashboard";
      //   // redirect("/dashboard");
      // }
    } catch (err) {
      console.error("eth sign in error", err);
      // debugger;
    } finally {
      // setLoading(false);
    }
  }

  return (
    <form action={signInAction}>
      <CardContent className="space-y-4">
        <Button onClick={handleEthSignIn} className="w-full">
          Sign in with Ethereum
        </Button>
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
            "Sign in"
          )}
        </Button>
        <div className="w-full text-right pt-2">
          <Link href="/sign-up" className="hover:underline ">
            or create a new account
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}
