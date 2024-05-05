import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";

interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    banner: string | null;
    global_name: string | null;
    banner_color: string | null;
    mfa_enabled: boolean;
    locale: string;
    email: string | null;
    verified: boolean;
}

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("discord_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400,
            headers: { Location: '/login' },
        });
    }
    try {

    } catch (e) {
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(JSON.stringify({ message: "Invalid code" }), {
                status: 400,
            });
        }

        return new Response(JSON.stringify({ message: "internal server error" }), {
            status: 500,
        });
    }
}
}