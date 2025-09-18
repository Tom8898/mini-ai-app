// app/api/posts/create/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 这里可以添加创建文章的逻辑
    const newPost = {
      id: `post-${Date.now()}`,
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
