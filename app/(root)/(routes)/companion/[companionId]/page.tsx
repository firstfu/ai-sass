import prismadb from "@/lib/prismadb";
import React from "react";
import CompanionForm from "./components/companion-form";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

export default async function CompanionIdPage({ params }: CompanionIdPageProps) {
  console.log("🚀 ~ file: page.tsx:10 ~ CompanionIdPage ~ params:", params);

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });
  console.log("🚀 ~ file: page.tsx:18 ~ CompanionIdPage ~ companion:", companion);

  const categories = await prismadb.category.findMany({});
  console.log("🚀 ~ file: page.tsx:21 ~ CompanionIdPage ~ categories:", categories);

  return <CompanionForm initialData={companion} categories={categories}></CompanionForm>;
}
