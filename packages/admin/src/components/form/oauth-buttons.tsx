"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Icons } from "../icons";

export const providers = [
    {
        id: "google",
        name: "Google",
        icon: <Icons.google className="mr-2 size-4" />,
    },
    {
        id: "github",
        name: "GitHub",
        icon: <Icons.gitHub className="mr-2 size-4" />,
    },
];

export const OAuthButtons: React.FC = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const handleSignIn = async (provider: typeof providers[number]) => {
    };

    return (
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            {providers.map((provider) => (
                <Button
                    key={provider.id}
                    aria-label={`Sign in with ${provider.name}`}
                    variant="outline"
                    onClick={() => handleSignIn(provider)}
                    className="w-full sm:w-auto"
                >
                    {provider.icon}
                    {provider.name}
                </Button>
            ))}
        </div>
    )
}