// app/workouts/page.tsx
import { getCurrentUser } from "@/lib/auth"; // assuming BetterAuth wrapper
import { db } from "@/database/db";
import { userWorkouts, workouts } from "@/database/schema"; // adjust import path
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Workouts</h1>
      {myWorkouts.length === 0 ? (
        <p className="text-gray-500">You haven't created any workouts yet.</p>
      ) : (
        <ul className="space-y-4">
          {myWorkouts.map((w) => (
            <li key={w.id} className="p-4 bg-gray-100 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{w.customName || w.name}</h2>
              {/* add more UI here if needed, like exercises */}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Button>Create Workout</Button>
      </div>
    </div>
  );
}
