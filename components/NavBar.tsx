"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu, Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export default function NavBar() {
  return (
    <div className="fixed w-full flex justify-between  py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <Menu className="md:hidden block" />
        <Link href="/">
          <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>companion.ai</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <UserButton afterSignOutUrl="/" />
        <Button
          size={"sm"}
          variant={"premium"}
          onClick={() => {
            alert("kk");
          }}
        >
          Upgrade
          <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
        </Button>
      </div>
    </div>
  );
}
