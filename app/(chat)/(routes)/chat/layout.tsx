import React, { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="  max-w-4xl mx-auto h-full w-full">{children}</div>;
}
