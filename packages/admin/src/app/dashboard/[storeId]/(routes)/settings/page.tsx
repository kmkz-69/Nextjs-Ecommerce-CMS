import { redirect } from "next/navigation";
import SettingsForm from "./components/settings-form";
import { validateRequest } from "@/lib/validators/validate-request";
import { db } from "@/servers/db";
import { stores } from "@/servers/db/schema";
import { and, eq } from "drizzle-orm";

interface SettingPageProps {
  params: {
    storeId: string;
  }
}

export default async function SettingsPage({ params }: SettingPageProps) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login")
  }

  const store = (await db.select().from(stores)
    .where(and(eq(stores.id, params.storeId), eq(stores.userId, user.id)))
    .limit(1))[0];

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
