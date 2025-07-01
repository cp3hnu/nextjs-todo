"use client";
import { usePathname } from "next/navigation";
import { logout } from "@/app/action";
import Link from "next/link";

export default function Sider() {
  const pathname = usePathname();
  const isMenuActive = (path: string) => pathname === path;

  const menus = [{ name: "Tasks", path: "/tasks" }];

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 text-white">
      <div className="flex h-16 items-center justify-center bg-gray-900">
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menus.map(menu => (
          <Link
            key={menu.name}
            href={menu.path}
            className={
              `block rounded px-4 py-2 transition-colors hover:bg-gray-700` +
              (isMenuActive(menu.path) ? " bg-gray-700" : "")
            }>
            {menu.name}
          </Link>
        ))}
      </nav>
      <button className="bg-gray-700 px-4 py-4 transition-colors hover:bg-gray-600 active:bg-gray-500" onClick={logout}>
        退出登录
      </button>
    </div>
  );
}
