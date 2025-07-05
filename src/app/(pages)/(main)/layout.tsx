import { Suspense } from "react";

import Sider from "./sider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <Sider />
      <div id="main" className="h-full flex-1 bg-gray-100">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            </div>
          }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
