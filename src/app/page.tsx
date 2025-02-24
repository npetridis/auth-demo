import { Profile } from "./Profile";
import { auth } from "@/lib/session/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <div className="text-center w-full">
        {JSON.stringify(session, null, 2)}
      </div>
      <Profile />;
    </div>
  );
}
