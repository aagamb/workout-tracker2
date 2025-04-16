'use server';

import { db } from "@/database/db";
import { workouts, userWorkouts, exercises } from "@/database/schema";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid"; // ✅ replacing uuid
import { revalidatePath } from "next/cache";

export async function createWorkout(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const name = formData.get("name") as string;
  const customName = formData.get("customName") as string;

  const workoutId = nanoid();
  const userWorkoutId = nanoid();

  await db.insert(workouts).values({
    id: workoutId,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(userWorkouts).values({
    id: userWorkoutId,
    workoutId,
    userId: user.id,
    customName,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true };
}

export async function addExercise(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const userWorkoutId = formData.get("userWorkoutId") as string;
  const name = formData.get("name") as string;
  const weight = parseInt(formData.get("weight") as string);
  const reps = formData.get("reps") as string;
  if (!name || isNaN(weight) || reps === "") return;

  await db.insert(exercises).values({
    id: nanoid(),
    userWorkoutId,
    name,
    weight,
    reps,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/workouts");
}
