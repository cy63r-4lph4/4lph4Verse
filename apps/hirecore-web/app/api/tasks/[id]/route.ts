// app/api/tasks/[id]/route.ts
import { fetchTaskById } from "@verse/hirecore-web/lib/taskService";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = Number(id);

  try {
    const task = await fetchTaskById(numericId);
    return NextResponse.json(task);
  } catch (err: any) {
    console.error("❌ Task fetch error:", err);
    const message = err.message?.includes("not found")
      ? "Task not found"
      : "Failed to fetch task";
    const status = err.message?.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
