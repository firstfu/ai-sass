import prismadb from "@/lib/prismadb";
import React from "react";
import CompanionForm from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

export default async function CompanionIdPage({ params }: CompanionIdPageProps) {
  console.log("🚀 ~ file: page.tsx:10 ~ CompanionIdPage ~ params:", params);

  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });
  console.log("🚀 ~ file: page.tsx:18 ~ CompanionIdPage ~ companion:", companion);

  const categories = await prismadb.category.findMany({});
  console.log("🚀 ~ file: page.tsx:21 ~ CompanionIdPage ~ categories:", categories);

  return <CompanionForm initialData={companion} categories={categories}></CompanionForm>;
}
