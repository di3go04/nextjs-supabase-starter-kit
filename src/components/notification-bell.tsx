"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/app/actions/notifications";

const TYPE_COLORS: Record<string, string> = {
  "billing.success": "bg-emerald-500",
  "billing.failed": "bg-rose-500",
  "role.changed": "bg-amber-500",
  system: "bg-blue-500",
  default: "bg-muted-foreground",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    const [notifs, count] = await Promise.all([getNotifications(), getUnreadCount()]);
    setNotifications(notifs);
    setUnread(count);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    intervalRef.current = setInterval(load, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    load();
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    load();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-medium text-sm">Notificaciones</span>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAll}
            >
              <Check className="mr-1 h-3 w-3" /> Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-30" />
              Sin notificaciones
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex items-start gap-3 p-3 cursor-default"
                onSelect={(e) => e.preventDefault()}
              >
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    TYPE_COLORS[n.type] ?? TYPE_COLORS.default
                  } ${n.read ? "opacity-30" : ""}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-muted-foreground" : "font-medium"}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
