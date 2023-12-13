import Categories from "@/components/categories";
import Companions from "@/components/companions";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import React from "react";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

export default async function RootPage({ searchParams }: RootPageProps) {
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      //   全文檢索
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany({});
  console.log("🚀 ~ file: page.tsx:8 ~ RootPage ~ categories:", categories);

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
}
