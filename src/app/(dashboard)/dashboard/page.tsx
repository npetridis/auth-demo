"use client";

import { Profile } from "@/app/Profile";
// import { useSession } from "next-auth/react";

export default function DashboardPage() {
  // const { data: session } = useSession();

  // console.log("SESSION", session);

  // if (!session) {
  //   return (
  //     <div>
  //       <h1>Dashboard</h1>
  //       <p>You need to be signed in to view this page</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Profile />
    </div>
  );
}
