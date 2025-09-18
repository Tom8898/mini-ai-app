// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import { getPostById } from '@/lib/posts';

export async function GET(request, { params }) {
  const post = getPostById(params.id);
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  return NextResponse.json({ post });
}

export async function PUT(request, { params }) {
  // 更新特定文章的逻辑
  return NextResponse.json({ message: 'Post updated' });
}

export async function DELETE(request, { params }) {
  // 删除特定文章的逻辑
  return NextResponse.json({ message: 'Post deleted' });
}
