import Categories from "@/components/categories";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import React from "react";

export default async function RootPage() {
  const categories = await prismadb.category.findMany({});
  console.log("🚀 ~ file: page.tsx:8 ~ RootPage ~ categories:", categories);

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
}
