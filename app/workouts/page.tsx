// app/workouts/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/database/db";
import { userWorkouts, workouts } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { createWorkout } from "./actions";
import WorkoutItem from "@/components/WorkoutItem";
import { revalidatePath } from "next/cache";

export default async function WorkoutsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Please sign in to view your workouts.</div>;
  }

  const myWorkouts = await db
    .select({
      id: userWorkouts.id,
      name: workouts.name,
      customName: userWorkouts.customName,
    })
    .from(userWorkouts)
    .innerJoin(workouts, eq(userWorkouts.workoutId, workouts.id))
    .where(eq(userWorkouts.userId, user.id));

  async function handleCreateWorkout(formData: FormData) {
    "use server";
    await createWorkout(formData);
    revalidatePath("/workouts");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Workouts</h1>

      {myWorkouts.length === 0 ? (
        <p className="text-gray-500">You haven't created any workouts yet.</p>
      ) : (
        <ul className="space-y-4">
          {myWorkouts.map((w) => (
            <WorkoutItem key={w.id} workout={w} />
          ))}
        </ul>
      )}

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
