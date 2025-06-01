"use client";

import { useNotifications } from "@/store/use-notifications";
import { NotificationToast } from "./NotificationToast";

export function NotificationProvider() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
} 