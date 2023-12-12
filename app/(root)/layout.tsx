import NavBar from "@/components/NavBar";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full">
      <NavBar />
      <main className=" h-full md:pl-20 pt-16">{children}</main>
    </div>
  );
}
