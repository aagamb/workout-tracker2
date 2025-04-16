'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import WorkoutItem from "./WorkoutItem";
import { createWorkout } from "@/app/workouts/actions";
import { revalidatePath } from "next/cache";

type Workout = {
  id: string;
  customName: string | null;
  name: string;
  exercises: {
    id: string;
    name: string;
    weight: number;
    reps: string;
  }[];
};

export default function WorkoutsClient({
  initialWorkouts,
}: {
  initialWorkouts: Workout[];
}) {
  const [workouts, setWorkouts] = useState(initialWorkouts);

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleCreateWorkout = async (formData: FormData) => {
    // You cannot use "use server" here — so this calls a server function
    await createWorkout(formData);
    revalidatePath("/workouts"); // or fetch the new workout client-side if needed
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Workouts</h1>

      <ul className="space-y-4">
        {workouts.map((w) => (
          <WorkoutItem key={w.id} workout={w} onDelete={handleDeleteWorkout} />
        ))}
      </ul>

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
