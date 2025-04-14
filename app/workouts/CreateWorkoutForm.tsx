// app/workouts/CreateWorkoutForm.tsx
import { createWorkout } from "./actions";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default function CreateWorkoutForm() {
  async function handleCreateWorkout(formData: FormData) {
    "use server";
    await createWorkout(formData);
    revalidatePath("/workouts");
  }

  return (
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
  );
}
