import { db } from "@/servers/db";
import { colors } from "@/servers/db/schema";
import { eq } from "drizzle-orm";
import ColorForm from "./components/color-form";

export default async function ColorPage({ params }: { params: { colorId: string } }) {
  const color = await db.select().from(colors)
    .where(eq(colors.id, params.colorId))
    .limit(1);

  if (!color || color.length === 0) {
    return <div>Color not found</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color[0]} />
      </div>
    </div>
  );
}
