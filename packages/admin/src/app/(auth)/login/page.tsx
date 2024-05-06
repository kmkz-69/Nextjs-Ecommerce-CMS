import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateRequest } from "@/lib/validators/validate-request";
import { SignInForm } from "@/components/form/sigin-form";
import { OAuthButtons } from "@/components/form/oauth-buttons";

export const metadata = {
    title: "Login",
    description: "Login Page",
}

export default async function Page() {
    const { user } = await validateRequest();

    if (user) redirect('/dashboard')

    return (
        <div className="flex h-auto min-h-screen w-full items-center justify-center">
            <Link href="/" className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "absolute left-4 top-4 md:left-8 md:top-8"
            )}>
                <Icons.chevronLeft className="mr-2 size-4" />
                Back
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <Icons.logo className="mx-auto size-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Login to your account
                    </p>
                </div>
                <Suspense>
                    <OAuthButtons />
                </Suspense>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
                        <span className="bg-background px-2">
                            Or continue with email & password
                        </span>
                    </div>
                </div>
                <Suspense>
                    <SignInForm />
                </Suspense>
                <div>
                    <span>Don&apos;t have an account? </span>
                    <Link  aria-label="Sign up"
                        href="/register"
                        className="font-bold tracking-wide text-primary underline-offset-4 transition-colors hover:underline"
                    >
                        Sign up
                        <span className="sr-only">Sign up</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}