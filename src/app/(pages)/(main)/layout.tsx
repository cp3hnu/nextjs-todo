import { Suspense } from "react";
import Sider from "./sider";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <Sider />
      <div id="main" className="flex-1 h-full bg-gray-100">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}