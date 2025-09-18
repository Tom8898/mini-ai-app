// app/blog/[id]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostById } from '@/lib/posts';

// 告诉 Next.js：这些 [id] 在构建时就要静态生成（SSG）
export function generateStaticParams() {
  return getAllPosts().map(p => ({ id: p.id }));
}

// 也可以配合 ISR：在 App Router 中用 "revalidate" 控制静态页面多久再生一次
export const revalidate = 60; // 60 秒增量更新（ISR，可选）

export default function BlogPost({ params }) {
  const post = getPostById(params.id);
  if (!post) return notFound();

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', lineHeight: 1.8 }}>
      <Link href="/">← 返回首页</Link>
      <h1 style={{ marginTop: 12 }}>{post.title}</h1>
      <p>{post.content}</p>

      <hr style={{ margin: '24px 0' }} />
      <p style={{ fontSize: 14, opacity: .7 }}>
        本页是 <b>SSG</b>（构建时生成），并设置了 <b>ISR</b>（revalidate=60）。
      </p>
    </main>
  );
}

