import React, { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl h-full w-full">{children}</div>;
}
