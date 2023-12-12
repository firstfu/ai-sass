import SearchInput from "@/components/search-input";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function RootPage() {
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
    </div>
  );
}
