
import { format } from "date-fns"

import BillboardClient from './components/client'
import { BillboardColumn } from './components/columns';
import { db } from "@/server/db";
import { billboards } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function BillboardsPage({ params }: { params: { storeId: string } }) {

  const billboard = await db.select().from(billboards)
    .where(eq(billboards.storeId, params.storeId))
    .orderBy(desc(billboards.createdAt));


    const formattedBillboards: BillboardColumn[] = billboard.map((item) => ({
      id: item.id,
      label: item.label ?? '',
      createdAt: format(item.createdAt ?? new Date(), "MMMM do, yyyy"),
    }));


  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}
