'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddExerciseForm from "./AddExerciseForm";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableExerciseItem from "./SortableExerciseItem";
import { DragEndEvent } from "@dnd-kit/core";

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
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // optional: drag starts after mouse moves 8px
      },
    })
  );

  const deleteWorkout = async () => {
    if (!confirm("Delete this entire workout? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user-workouts/${workout.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workout");
      router.refresh(); 
    } catch {
      alert("Error deleting workout");
    } finally {
      setIsDeleting(false);
    }
  };

  const saveExerciseOrder = async () => {
    const newOrder = exercises.map((exercise, index) => ({
      id: exercise.id,
      order: index, // 0, 1, 2, etc.
    }));
  
    await fetch('/api/exercises/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    });
  
    toast.success("Exercise order saved!");
  };

  const handleUpdate = (updatedExercise: { id: string; name: string; weight: number; reps: string }) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  };

  const handleEdit=() => {
    setEditMode((prev) => {
      const newEditMode = !prev;
      if (newEditMode) {
        setExpanded(true); // ✅ force expand when entering edit mode
      }
      return newEditMode;
    });
  }


const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (active.id !== over?.id) {
    setExercises((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id);
      const newIndex = prev.findIndex((e) => e.id === over?.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    saveExerciseOrder();
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
          <Button variant="outline" size="sm" onClick={handleEdit}>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={exercises.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {exercises.map((exercise) => (
                    <SortableExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      editable={editMode}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
          {editMode && (
            <AddExerciseForm userWorkoutId={workout.id} />
          )}
        </div>
      )}
    </li>
  );
}
