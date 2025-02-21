"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";

export function Profile() {
  const { address } = useAccount();
  const { data, error, status } = useEnsName({ address });

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b-2 w-full">
        <h1 className="text-xl">Dashboard</h1>
        <ConnectButton />
      </header>
      <div className="flex justify-center pt-32">
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div>Address: {address}</div>
          {status === "pending" && <div>Loading ENS name</div>}
          {status === "error" && (
            <div>Error fetching ENS name: {error.message}</div>
          )}
          {status === "success" && <div>ENS name: {data}</div>}
        </div>
      </div>
    </>
  );
}
