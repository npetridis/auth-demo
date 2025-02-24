import { getUserByEmail } from "@/lib/db/queries";
import { sessionOptions } from "@/lib/session";
import { defaultSession, SessionData } from "@/lib/session/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// get session
export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

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
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.destroy();

  return Response.json(defaultSession);
}
