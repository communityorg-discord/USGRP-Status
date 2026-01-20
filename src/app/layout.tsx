import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "USGRP Status",
    description: "System status, changelogs, and community feedback portal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
