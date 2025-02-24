"use client";

import { useState, useEffect } from "react";
import { SessionData } from "./session";

// use client side fetch to get session data
// TODO:  might need caching or to be moved in a provider and use context to access data
const useSession = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const sessionData = await response.json();
        console.log("sessionData", sessionData);
        setSession(sessionData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, loading, error };
};

export default useSession;
