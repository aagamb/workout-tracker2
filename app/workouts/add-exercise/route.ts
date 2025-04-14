// app/workouts/add-exercise/route.ts
import { addExercise } from "../actions";

export async function POST(req: Request) {
  const formData = await req.formData();
  await addExercise(formData);
  return new Response(null, {
    status: 302,
    headers: { Location: "/workouts" },
  });
}
