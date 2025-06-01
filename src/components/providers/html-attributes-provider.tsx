"use client";

import { useEffect } from "react";

export default function HtmlAttributesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add dark mode class to html element
    document.documentElement.classList.add("dark");
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";
    // Set color scheme
    document.documentElement.style.colorScheme = "dark";
  }, []);

  return children;
} 