"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { motion } from "framer-motion";

export function RouteLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    setIsLoading(true);
    setFadeIn(false);
    // Show loading screen for 3 seconds
    timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setFadeIn(true), 50); // Small delay for smoother transition
    }, 3000);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {isLoading ? <LoadingScreen isLoading={true} /> : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeIn ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
} 