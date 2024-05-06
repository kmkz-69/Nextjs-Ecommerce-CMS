"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { LoginInput, loginSchema } from "@/lib/validators/auth";
import { login } from "@/actions/auth/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

export const SignInForm = () => {
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        const formData = new FormData();
        formData.set('email', data.email);
        formData.set('password', data.password);
        const response = await login(null, formData);
        if (response.formError) {
            alert(response.formError);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-between">
                    <Link href="/reset-password" className="text-sm text-gray-400 hover:text-white">
                        Forgot Password?
                    </Link>
                </div>
                <Button type="submit">
                    Log In
                </Button>
            </form>
        </Form>
    )
}