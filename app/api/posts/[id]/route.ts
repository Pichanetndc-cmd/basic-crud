import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get a single post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    console.log("params:", await params);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, {  status: 404 });

    return NextResponse.json(post);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update a post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    const { title, content } = await req.json();

    const updated = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete a post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
