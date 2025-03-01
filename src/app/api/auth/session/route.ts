import { getUserByEmail } from "@/lib/db/queries";
import { auth } from "@/lib/session/auth";
import { defaultSession } from "@/lib/session/session";

// get session
export async function GET() {
  const session = await auth();

  // Might not be necessary to check if the user exists
  const user = await getUserByEmail(session.email);
  if (!user) {
    return Response.json(defaultSession);
  }

  if (!session || !session.isLoggedIn) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// delete session
export async function DELETE() {
  const session = await auth();

  session.destroy();

  return Response.json(defaultSession);
}
