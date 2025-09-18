// app/api/posts/route.js
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  return NextResponse.json({ posts: getAllPosts() });
}
