import { getUserByEmail } from "@/lib/db/queries";
import { auth, isSessionExpired, refreshSessionIfNeeded } from "@/lib/session/auth";
import { defaultSession } from "@/lib/session/session";

// get session
export async function GET() {
  const session = await auth();

  // Check if session is valid
  if (!session || !session.isLoggedIn) {
    return Response.json(defaultSession);
  }

  // Check if session has expired
  if (await isSessionExpired(session)) {
    // Try to refresh session
    const refreshed = await refreshSessionIfNeeded(session);
    if (!refreshed) {
      // If refresh failed, return default session
      return Response.json(defaultSession);
    }
  }

  // Verify user still exists in database
  if (session.email) {
    const user = await getUserByEmail(session.email);
    if (!user) {
      return Response.json(defaultSession);
    }
  }

  return Response.json(session);
}

// delete session
export async function DELETE() {
  const session = await auth();

  session.destroy();

  return Response.json(defaultSession);
}
