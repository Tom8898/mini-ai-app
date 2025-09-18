// app/page.js
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

// 标记此页面“强制动态”，每次请求渲染（演示 SSR 感觉更直观）
export const dynamic = 'force-dynamic';

export default function Home() {
  const posts = getAllPosts();
  const now = new Date().toLocaleString();

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', lineHeight: 1.6 }}>
      <h1>Mini Next Blog</h1>
      <p>现在时间（SSR 每次请求刷新）：{now}</p>
      <h2>文章列表</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <Link href={`/blog/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
      <p style={{marginTop: 24, fontSize: 14, opacity: .7}}>
        Tips：此首页为 <b>SSR</b>（dynamic=force-dynamic），而具体文章页我们用 <b>SSG</b>。
      </p>
    </main>
  );
}