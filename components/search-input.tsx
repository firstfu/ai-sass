"use client";

import { Search } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");
  const [value, setValue] = useState(name || "");

  //   導入自己寫的useDebounce hook
  const debouncedValue = useDebounce<string>(value, 500);
  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    console.log("onChange:", e.target.value);
    setValue(e.target.value);
  };

  useEffect(() => {
    // console.log("useEffect debouncedValue...:", debouncedValue);
    const query = {
      name: debouncedValue,
      categoryId: categoryId,
    };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [categoryId, debouncedValue, router]);

  return (
    <div className="relative">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input placeholder="Search" className="pl-10 bg-primary/10" onChange={onChange} value={value} />
    </div>
  );
}
