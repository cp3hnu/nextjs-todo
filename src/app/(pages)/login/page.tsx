'use client';

import "@app/globals.css";
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from "react";
import { login } from "@app/action";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, undefined);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (state?.success) {
        router.push(`/tasks`);
      }
    }, 1000);
  }, [state, router]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form className="space-y-6" action={formAction}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
            <input type="text" id="username" name="username" required className="input-base" placeholder="请输入用户名" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
            <input type="password" id="password" name="password" required className="input-base" placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button type="submit" className="primary-button" disabled={isPending}>
              登录
            </button>
            <button type="button" className="secondary-button" onClick={() => {
              router.push('/register');
            }} disabled={isPending}>
              注册
            </button>
          </div>
          {state && (
            <div className={`mt-4 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}