import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(posts);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to load posts", detail: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const post = await prisma.post.create({ data: { title, content } });
    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to create", detail: e.message }, { status: 500 });
  }
}

export const runtime = 'nodejs'