import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Create Todo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="algolia-site-verification" content="7C97ECAD45DCF3E8" />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
