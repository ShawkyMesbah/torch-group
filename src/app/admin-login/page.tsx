// src/app/admin-login/page.tsx
// This page provides a custom login form for administrators.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?admin=1");
  }, [router]);
  return null;
} 