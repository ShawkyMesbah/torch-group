"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X 
} from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationToastProps {
  type: NotificationType;
  message: string;
  title?: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

const textColors = {
  success: "text-green-800 dark:text-green-200",
  error: "text-red-800 dark:text-red-200",
  warning: "text-yellow-800 dark:text-yellow-200",
  info: "text-blue-800 dark:text-blue-200",
};

export function NotificationToast({
  type,
  message,
  title,
  onClose,
  duration = 5000,
}: NotificationToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg ${colors[type]}`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 shrink-0 ${textColors[type]}`} />
          <div className="flex-1">
            {title && (
              <h3 className={`font-medium ${textColors[type]}`}>{title}</h3>
            )}
            <p className={`text-sm ${textColors[type]}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`shrink-0 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5 ${textColors[type]}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 