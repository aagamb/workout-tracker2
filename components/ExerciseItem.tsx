'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  exercise: {
    id: string;
    name: string;
    weight: number;
    reps: number;
  };
  editable?: boolean;
};

export default function ExerciseItem({ exercise, editable = false }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="border p-2 rounded bg-black">
      <div className="flex justify-between items-center">
        <span className="font-medium">{exercise.name}</span>
        <div className="space-x-2">
          {editable && <Button size="sm" variant="outline">Drag</Button>}
          <Button size="sm" variant="outline" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Hide" : "Details"}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Weight: {exercise.weight}kg</p>
          <p>Reps: {exercise.reps}</p>
        </div>
      )}
    </li>
  );
}
