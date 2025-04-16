import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Exercise = {
  id: string;
  name: string;
  weight: number;
  reps: string;
};

type Props = {
  exercise: Exercise;
  editable?: boolean;
  onDelete?: (id: string) => void; // optional callback to remove it from parent list
};

export default function ExerciseItem({ exercise, editable = false, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Exercise>(exercise);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (field: keyof Exercise, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update exercise');
      toast.success('Exercise updated');
      setIsEditing(false);
    } catch {
      toast.error('Error updating exercise');
    }
  };

  const deleteExercise = async () => {
    if (!confirm("Are you sure you want to delete this exercise?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete exercise');
      toast.success('Exercise deleted');
      if (onDelete) onDelete(exercise.id);
    } catch {
      toast.error('Error deleting exercise');
    } finally {
      setIsDeleting(false);
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
            <Button size="sm" variant="destructive" onClick={deleteExercise} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
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
