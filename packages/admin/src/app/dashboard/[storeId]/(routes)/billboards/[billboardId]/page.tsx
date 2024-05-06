import { eq } from "drizzle-orm";
import BillboardForm from "./components/billboard-form";
import { billboards } from "@/server/db/schema";
import { db } from "@/server/db";

export default async function BillboardPage({ params }:
  { params: { billboardId: string } }
) {
  const billboard = await db.select().from(billboards)
    .where(eq(billboards.id, params.billboardId));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}

