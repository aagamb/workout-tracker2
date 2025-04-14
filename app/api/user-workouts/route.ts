import { db } from "@/database/db";
import { userWorkouts, workouts } from "@/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db
    .select({
      id: userWorkouts.id,
      name: workouts.name,
      customName: userWorkouts.customName,
    })
    .from(userWorkouts)
    .innerJoin(workouts, eq(userWorkouts.workoutId, workouts.id))
    .where(eq(userWorkouts.userId, user.id));

  return NextResponse.json(data);
}
