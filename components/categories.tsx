"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React from "react";

interface CategoriesProps {
  data: Category[];
}

export default function Categories({ data }: CategoriesProps) {
  const route = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  console.log("🚀 ~ file: categories.tsx:15 ~ Categories ~ searchParams:", searchParams);

  const onClick = (id: string | undefined) => {
    const query = {
      categoryId: id,
    };
    console.log("query:", query);
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      {
        skipNull: true,
      }
    );
    route.push(url);
  };

  return (
    <div className="w-full  overflow-x-auto space-x-2 flex p-1">
      <button
        className={cn(
          `
            flex
            items-center
            text-center
            text-xs
            md:text-sm
            px-2
            md:px-4
            py-2
            md:py-3
            rounded-md
            bg-primary/10
            hover:opacity-75
            transition
        `,
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
        onClick={() => onClick(undefined)}
      >
        Newest
      </button>

      {data.map(item => {
        return (
          <button
            key={item.id}
            className={cn(
              `
            flex
            items-center
            text-center
            text-xs
            md:text-sm
            px-2
            md:px-4
            py-2
            md:py-3
            rounded-md
            bg-primary/10
            hover:opacity-75
            transition
        `,
              item.id === categoryId ? "bg-primary/25" : "bg-primary/10"
            )}
            onClick={() => onClick(item.id)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}
