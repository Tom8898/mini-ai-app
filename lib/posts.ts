// lib/posts.ts
export const posts = [
    { id: 'hello-next', title: 'Hello Next.js', content: 'Next.js 是基于 React 的全栈框架。' },
    { id: 'learn-ssg',   title: '学会 SSG',      content: 'SSG 在构建时生成静态页面，速度飞快。' },
    { id: 'learn-ssr',   title: '学会 SSR',      content: 'SSR 在请求时在服务端渲染，SEO 友好。' },
  ];
  
  export function getAllPosts() {
    return posts;
  }
  
  export function getPostById(id: string) {
    return posts.find(p => p.id === id) || null;
  }
