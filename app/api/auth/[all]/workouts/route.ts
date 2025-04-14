// app/api/workouts/route.ts
import { db } from "@/database/db";
import { userWorkouts, workouts } from "@/database/schema";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  
const  user = await getCurrentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, customName } = await req.json();

  const workoutId = uuidv4();
  const userWorkoutId = uuidv4();

  // Check if workout type already exists or insert
  const existingWorkout = await db
    .select()
    .from(workouts)
    .where(eq(workouts.name, name))
    .limit(1);

  const workoutToUse = existingWorkout[0] || {
    id: workoutId,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!existingWorkout[0]) {
    await db.insert(workouts).values(workoutToUse);
  }

  await db.insert(userWorkouts).values({
    id: userWorkoutId,
    workoutId: workoutToUse.id,
    userId: user.id,
    customName,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
