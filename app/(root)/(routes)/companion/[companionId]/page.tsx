import prismadb from "@/lib/prismadb";
import React from "react";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

export default async function CompanionIdPage({ params }: CompanionIdPageProps) {
  console.log("🚀 ~ file: page.tsx:10 ~ CompanionIdPage ~ params:", params);

  const companion = await prismadb.campanion.findUnique({
    where: {
      id: params.companionId,
    },
  });
  console.log("🚀 ~ file: page.tsx:18 ~ CompanionIdPage ~ companion:", companion);

  return <div>Hello CompanionIdPage</div>;
}
