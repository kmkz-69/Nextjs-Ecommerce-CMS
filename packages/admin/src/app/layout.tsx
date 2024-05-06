import type { Metadata } from "next";

import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from '@/providers/theme-provider'

import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for an E-Commerce store built with Nextjs and TailwindCSS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ModalProvider />
            <Toaster richColors />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
