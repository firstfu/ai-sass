import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    console.log("🚀 ~ file: route.ts:7 ~ POST ~ body:", body);
    console.log("🚀 ~ file: route.ts:8 ~ POST ~ user:", user);

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // TODO: check for subscription

    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:6 ~ POST ~ error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
