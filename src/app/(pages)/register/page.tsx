"use client";

import "@/app/globals.css";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { register } from "@/app/action";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(register, undefined);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.success) {
      router.push(`/login`);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <form className="space-y-6" action={formAction}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="input-base"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-base"
              placeholder="请输入邮箱"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="input-base"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button type="submit" className="primary-button" disabled={isPending}>
              注册
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                router.push("/login");
              }}
              disabled={isPending}>
              取消
            </button>
          </div>
          {state && (
            <div className={`mt-4 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
