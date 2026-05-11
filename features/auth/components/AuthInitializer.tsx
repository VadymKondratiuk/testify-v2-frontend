"use client";

import { useEffect, useRef } from "react";
import { AuthService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";

export function AuthInitializer() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let isMounted = true;

    AuthService.refresh()
      .then(({ user }) => {
        if (isMounted) {
          useAuthStore.getState().setUser(user);
        }
      })
      .catch(() => {
        if (isMounted) {
          useAuthStore.getState().clearAuth();
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
