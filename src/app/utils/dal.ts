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

// export const getUser = cache(async () => {
//   const session = await verifySession();
//   if (!session) return null;

//   try {
//     const data = await db.query.users.findMany({
//       where: eq(users.id, session.userId),
//       // Explicitly return the columns you need rather than the whole user object
//       columns: {
//         id: true,
//         name: true,
//         email: true
//       }
//     });

//     const user = data[0];

//     return user;
//   } catch (error) {
//     console.log("Failed to fetch user", error);
//     return null;
//   }
// });
