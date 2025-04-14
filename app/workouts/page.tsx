// app/workouts/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/database/db";
import { userWorkouts, workouts, exercises } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import WorkoutItem from "@/components/WorkoutItem";
import { createWorkout } from "./actions";
import { revalidatePath } from "next/cache";

export default async function WorkoutsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Please sign in to view your workouts.</div>;
  }

  // Fetch workouts + nested exercises
  const userWorkoutRecords = await db
    .select()
    .from(userWorkouts)
    .where(eq(userWorkouts.userId, user.id));

  const workoutDetails = await Promise.all(
    userWorkoutRecords.map(async (uw) => {
      const workout = await db.query.workouts.findFirst({
        where: eq(workouts.id, uw.workoutId),
      });

      const allExercises = await db
        .select()
        .from(exercises)
        .where(eq(exercises.userWorkoutId, uw.id));

      return {
        id: uw.id,
        customName: uw.customName,
        name: workout?.name || "",
        exercises: allExercises,
      };
    })
  );

  async function handleCreateWorkout(formData: FormData) {
    "use server";
    await createWorkout(formData);
    revalidatePath("/workouts");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Workouts</h1>

      <ul className="space-y-4">
        {workoutDetails.map((w) => (
          <WorkoutItem key={w.id} workout={w} />
        ))}
      </ul>

      {/* Create Workout Form */}
      <form action={handleCreateWorkout} className="mt-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Workout Type (e.g., Arms)"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="customName"
          placeholder="Custom Workout Name"
          className="border p-2 rounded w-full"
        />
        <Button type="submit">Create Workout</Button>
      </form>
    </div>
  );
}
