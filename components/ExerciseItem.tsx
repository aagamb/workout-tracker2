'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Assuming you use Sonner for notifications

type Exercise = {
  id: string;
  name: string;
  weight: number;
  reps: string;
};

type Props = {
  exercise: Exercise;
  editable?: boolean;
};

export default function ExerciseItem({ exercise, editable = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Exercise>(exercise);

  const handleChange = (field: keyof Exercise, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update exercise');
      toast.success('Exercise updated');
      setIsEditing(false);
    } catch (err) {
      toast.error('Error updating exercise');
    }
  };

  const weightInKg = (exercise.weight * 0.453592).toFixed(1);

  return (
    <li className="border p-2 rounded bg-black text-white">
      <div className="flex justify-between items-center">
        <span className="font-medium">{exercise.name}</span>
        {editable && (
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {isEditing && (
              <Button size="sm" variant="default" onClick={saveChanges}>
                Save
              </Button>
            )}
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="mt-2 text-sm text-gray-400">
          <p>Weight: {exercise.weight}lb ({weightInKg}kg)</p>
          <p>Reps: {exercise.reps}</p>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Exercise Name"
          />
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
            placeholder="Weight (lb)"
          />
          <Input
            value={formData.reps}
            onChange={(e) => handleChange("reps", e.target.value)}
            placeholder="Reps"
          />
        </div>
      )}
    </li>
  );
}
