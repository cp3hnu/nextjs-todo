import { NextRequest, NextResponse } from "next/server";

import { dbGetTasks } from "@/app/db";
import { verifySession } from "@/app/utils/dal";

export async function GET(request: NextRequest) {
  const session = await verifySession();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const tasks = await dbGetTasks(userId, params.title);
  return NextResponse.json(tasks);
}
