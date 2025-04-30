import { redirect } from 'next/navigation';

export default function Home() {
  redirect("/workouts"); // or whatever route you want
}