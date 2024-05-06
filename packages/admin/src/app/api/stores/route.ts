import { validateRequest } from "@/lib/validators/validate-request";
import { db } from "@/server/db";
import { stores } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    const body = await req.json();

    const { name } = body;

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });

    const store = await db.insert(stores).values({
      name,
      userId: user.id
    }).returning();

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};