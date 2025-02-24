import { Profile } from "@/app/Profile";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Suspense>
        <Profile />
      </Suspense>
    </div>
  );
}
