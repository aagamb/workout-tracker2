'use client'

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExerciseItem from "./ExerciseItem";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Props = {
  exercise: {
    id: string;
    name: string;
    weight: number;
    reps: string;
  };
  editable: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (updatedExercise: any) => void;
};

export default function SortableExerciseItem({ exercise, editable, onDelete, onUpdate }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: exercise.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="flex items-center space-x-2">
        <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-white"
            aria-label="Drag Handle"
            >
            <DragIndicatorIcon fontSize="small" />
        </button>
        <div className="flex-1">
        <ExerciseItem
            exercise={exercise}
            editable={editable}
            onDelete={onDelete}
            onUpdate={onUpdate}
        />
        </div>
      </div>
    </li>
  );
}