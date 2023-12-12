import NavBar from "@/components/nav-bar";
import Sidebar from "@/components/side-bar";

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full">
      <NavBar />
      <div className="fixed inset-y-0 hidden md:flex mt-16 w-20 flex-col ">
        <Sidebar />
      </div>
      <main className=" h-full md:pl-20 pt-16">{children}</main>
    </div>
  );
}
