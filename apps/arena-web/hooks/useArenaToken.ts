"use client";

import { useEffect, useState } from "react";

export function useArenaToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("arena_token"));
  }, []);

  return token;
}