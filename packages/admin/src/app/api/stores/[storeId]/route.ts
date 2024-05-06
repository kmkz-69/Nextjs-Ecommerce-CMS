import { validateRequest } from "@/lib/validators/validate-request";
import { db } from "@/servers/db";
import { stores } from "@/servers/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateStoreSchema = z.object({
  name: z.string().min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { user } = await validateRequest();
    const body = await req.json();

    const storeId = params.storeId;
    const { name } = updateStoreSchema.parse(body);

    const storeExist = await db.select().from(stores)
      .where(eq(stores.id, storeId)).limit(1);

    if (!storeExist) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const store = await db.update(stores).set({ name })
      .where(and(eq(stores.id, storeId), eq(stores.userId, user.id)));

    return NextResponse.json({ message: "Store updated successfully", store });
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const { user } = await validateRequest();

    const storeId = params.storeId;

    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeExist = await db.select().from(stores)
      .where(eq(stores.id, storeId)).limit(1);

    if (!storeExist) return NextResponse.json({ msg: "Store not found" }, { status: 404 });

    const store = await db.delete(stores)
      .where(and(eq(stores.id, storeId), eq(stores.userId, user.id)));

    return NextResponse.json({ msg: "Store deleted successfully" });
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}