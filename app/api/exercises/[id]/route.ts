import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/db";
import { exercises } from "@/database/schema"; // Adjust to match your schema
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // ✅ access asynchronously
  
    const data = await req.json();
  
    try {
      await db.update(exercises).set({
        name: data.name,
        weight: data.weight,
        reps: data.reps,
      }).where(eq(exercises.id, id));
  
      return NextResponse.json({ message: "Exercise updated" });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 });
    }
  }
  