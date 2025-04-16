import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/db";
import { userWorkouts, exercises } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    // Delete all exercises tied to this userWorkout
    await db.delete(exercises).where(eq(exercises.userWorkoutId, id));
    // Then delete the userWorkout
    await db.delete(userWorkouts).where(eq(userWorkouts.id, id));

    return NextResponse.json({ message: "Workout deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
  }
}
