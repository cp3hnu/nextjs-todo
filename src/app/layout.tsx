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
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
