import { auth } from "@/auth";
import { Profile } from "./Profile";

export default async function Home() {
  const session = await auth();
  console.log("session", session);
  return (
    <div>
      <div className="text-center w-full">
        {JSON.stringify(session, null, 2)}
      </div>
      <Profile />;
    </div>
  );
}
