import { validateRequest } from "@/lib/validators/validate-request";
import { db } from "@/servers/db";
import { stores } from "@/servers/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function SetUpLayout({ children }: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  };

  const store = await db.select().from(stores)
    .where(eq(stores.userId, user.id))
    .limit(1);

  if (store) {
    redirect(`/${store[0]?.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};