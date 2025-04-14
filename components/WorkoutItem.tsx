'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Workout = {
  id: string;
  name: string;
  customName: string | null;
};

export default function WorkoutItem({ workout }: { workout: Workout }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="p-4 bg-gray-100 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{workout.customName || workout.name}</h2>
        <Button variant="outline" size="sm" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">Exercise management UI goes here...</p>
          {/* Add future exercise form/list here */}
        </div>
      )}
    </li>
  );
}
