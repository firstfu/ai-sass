import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function RootPage() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
