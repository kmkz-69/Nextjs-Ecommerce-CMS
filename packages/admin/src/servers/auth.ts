import { Lucia, TimeSpan } from "lucia";
import { Google } from "arctic";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users, type User as DbUser } from "@/servers/db/schema";
import { db } from "./db";
import { env } from "@/env";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

const lucia = new Lucia(adapter, {
    getSessionAttributes: () => {
        return {}
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            emailVerified: attributes.emailVerified,
            avatar: attributes.avatar,
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
        }
    },
    sessionExpiresIn: new TimeSpan(30, "d"),
    sessionCookie: {
        name: "session",
        expires: false, // session cookies have very long lifespan (2 years)
        attributes: {
            secure: env.NODE_ENV === "production",
        },
    },
})

// export const google = new Google(
//     env.AUTH_GOOGLE_ID,
//     env.AUTH_GOOGLE_SECRET,
  
// );

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseSessionAttributes { }
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> { }