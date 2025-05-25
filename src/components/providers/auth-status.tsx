"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface AuthStatusProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * مكون للتحقق من حالة المصادقة في واجهة المستخدم
 * 
 * @param children المحتوى المراد عرضه عند توفر المصادقة المطلوبة
 * @param fallback المحتوى البديل عند عدم توفر المصادقة
 * @param requireAuth هل تتطلب مصادقة المستخدم؟
 * @param requireAdmin هل تتطلب صلاحيات المسؤول؟
 */
export function AuthStatus({
  children,
  fallback = null,
  requireAuth = false,
  requireAdmin = false,
}: AuthStatusProps) {
  const { data: session, status } = useSession();
  const [customSession, setCustomSession] = useState<boolean>(false);
  
  // التحقق من وجود جلسة مخصصة
  useEffect(() => {
    const hasCustomSession = document.cookie.includes('session=') || document.cookie.includes('session_active=');
    setCustomSession(hasCustomSession);
  }, []);
  
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" || customSession;
  const isAdmin = session?.user?.role === "ADMIN";
  
  // إذا كان جاري التحميل، يمكن عرض شاشة تحميل
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[20vh]">
      <div className="animate-pulse">جاري التحميل...</div>
    </div>;
  }
  
  // التحقق من صلاحيات المستخدم
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }
  
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    return fallback;
  }
  
  return <>{children}</>;
} 