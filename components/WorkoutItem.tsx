'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import ExerciseItem from "./ExerciseItem";
import AddExerciseForm from "./AddExerciseForm";

type WorkoutWithExercises = {
  id: string;
  name: string;
  customName: string | null;
  exercises: {
    id: string;
    name: string;
    weight: number;
    reps: string;
  }[];
};

export default function WorkoutItem({
  workout,
  onDelete,
}: {
  workout: WorkoutWithExercises;
  onDelete?: (id: string) => void;
}) 
{
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exercises, setExercises] = useState(workout.exercises); // ✅ local state
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteWorkout = async () => {
    if (!confirm("Delete this entire workout? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user-workouts/${workout.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workout");
      onDelete?.(workout.id); // Notify parent to remove from UI
    } catch {
      alert("Error deleting workout");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleDelete = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id)); // ✅ update UI on delete
  };

  return (
    <li className="p-4 bg-black-100 rounded shadow-sm border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{workout.customName || workout.name}</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? "Done" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button
  variant="destructive"
  size="sm"
  onClick={deleteWorkout}
  disabled={isDeleting}
>
  {isDeleting ? "Deleting..." : "Delete Workout"}
</Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {exercises.length === 0 ? (
            <p className="text-sm text-gray-600">No exercises yet.</p>
          ) : (
            <ul className="space-y-2">
              {exercises.map((exercise) => (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  editable={editMode}
                  onDelete={handleDelete} // ✅ pass the handler
                />
              ))}
            </ul>
          )}
          {editMode && (
            <AddExerciseForm userWorkoutId={workout.id} />
          )}
        </div>
      )}
    </li>
  );
}
