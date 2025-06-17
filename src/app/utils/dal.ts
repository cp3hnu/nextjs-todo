import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/utils/session";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect("/login");
  }

  const session = await decrypt(cookie);
  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: Number(session.userId) };
});
