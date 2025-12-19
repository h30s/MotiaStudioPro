import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Motia Studio Pro | AI-Powered Backend Development",
    description: "Generate production-ready Motia backends with AI in 90 seconds. Visual workflow builder, one-click deploy, and built-in observability.",
    keywords: ["Motia", "AI", "Backend", "Developer Tools", "Code Generation", "Workflow Builder"],
    authors: [{ name: "Himanshu Soni" }],
    openGraph: {
        title: "Motia Studio Pro",
        description: "Build production backends in 90 seconds with AI",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster position="top-right" richColors />
                </Providers>
            </body>
        </html>
    );
}
