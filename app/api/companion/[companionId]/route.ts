import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { companionId: string } }) {
  try {
    console.log("🚀 ~ file: route.ts:6 ~ PATCH ~ params:", params);

    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.companionId) {
      return new NextResponse("Missing companionId", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // TODO: check for subscription

    const companion = await prismadb.companion.update({
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
      where: {
        id: params.companionId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:6 ~ POST ~ error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { companionId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:55 ~ DELETE ~ error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
