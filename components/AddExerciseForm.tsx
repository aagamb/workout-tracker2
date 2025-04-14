// components/AddExerciseForm.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddExerciseForm({ userWorkoutId }: { userWorkoutId: string }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-2">
      {!showForm ? (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
          + Add Exercise
        </Button>
      ) : (
        <form action="/workouts/add-exercise" method="POST" className="space-y-2">
          <input type="hidden" name="userWorkoutId" value={userWorkoutId} />
          <input
            type="text"
            name="name"
            placeholder="Exercise name"
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="reps"
            placeholder="Reps"
            required
            className="border p-2 rounded w-full"
          />
          <div className="flex space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
