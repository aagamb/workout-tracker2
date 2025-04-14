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
    reps: number;
  }[];
};

export default function WorkoutItem({ workout }: { workout: WorkoutWithExercises }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {workout.exercises.length === 0 ? (
            <p className="text-sm text-gray-600">No exercises yet.</p>
          ) : (
            <ul className="space-y-2">
              {workout.exercises.map((exercise) => (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  editable={editMode}
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
