"use client";

import { cn } from "@/lib/utils";
import { Home, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const pathName = usePathname();
  const router = useRouter();

  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
      pro: false,
    },
    {
      icon: Plus,
      href: "/companion/new",
      label: "Create",
      pro: true,
    },
    {
      icon: Settings,
      href: "/settings",
      label: "settings",
      pro: false,
    },
  ];

  const onNavigate = (url: string, pro: boolean) => {
    return router.push(url);
  };

  return (
    <div className="space-y-4 flex flex-col h-full bg-secondary">
      <div className="p-3 flex flex-1  justify-center">
        <div className="space-y-2">
          {routes.map(route => {
            return (
              // item
              <div
                key={route.href}
                className={cn(
                  "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathName === route.href && "text-primary bg-primary/10"
                )}
                onClick={() => onNavigate(route.href, route.pro)}
              >
                {/* label */}
                <div className="flex flex-col gap-y-2 items-center flex-1">
                  <route.icon className="w-5 h-5" />
                  {route.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
