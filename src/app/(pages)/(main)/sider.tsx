'use client';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/action';

export default function Sider() {
  const pathname = usePathname();
  const isMenuActive = (path: string) => pathname === path;

  const menus = [
    { name: "Tasks", path: "/tasks" },
  ];

  return (

    <div className="flex flex-col h-full w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menus.map((menu) => (
          <a
            key={menu.name}
            href={menu.path}
            className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors` + (isMenuActive(menu.path) ? " bg-gray-700" : "")}
          >
            {menu.name}
          </a>
        ))}
      </nav>
      <button className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors" onClick={() => logout()}>Logout</button>
    </div>
  );
}