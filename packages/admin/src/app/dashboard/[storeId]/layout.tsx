import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";
import { validateRequest } from "@/lib/validators/validate-request";
import { db } from "@/server/db";
import { stores } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { storeId: string }
}) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  const store = await db.select().from(stores)
    .where(and(
      eq(stores.id, params.storeId),
      eq(stores.userId, user.id)
    )).limit(1);

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};