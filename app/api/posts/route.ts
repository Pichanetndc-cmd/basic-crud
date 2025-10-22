import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all posts
export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

// CREATE a post
export async function POST(req: Request) {
  const { title, content } = await req.json();
  const post = await prisma.post.create({ data: { title, content } });
  return NextResponse.json(post);
}
