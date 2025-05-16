/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<null | {
    id: number;
    name?: string;
    email: string;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [refresh]);

  return {
    user,
    isLoggedIn: !!user,
    loading,
    refetchUser: () => setRefresh((prev) => prev + 1),
  };
}
