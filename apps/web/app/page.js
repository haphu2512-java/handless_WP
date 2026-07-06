'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        // Fetch từ Next.js API route (recommended)
        // hoặc trực tiếp từ WordPress nếu CORS được enable
        const response = await fetch('/api/posts', {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status} - Không thể lấy dữ liệu từ WordPress`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Headless WordPress + Next.js</p>
        <h1>Frontend được xây dựng bằng React, dữ liệu lấy trực tiếp từ WordPress API</h1>
        <p>
          Next.js dùng để render UI, còn React phía client sẽ fetch dữ liệu từ WordPress REST API.
        </p>
      </section>

      <section className="content">
        {loading && <p>Đang tải bài viết...</p>}
        {error && <p className="error">⚠️ {error}</p>}
        {!loading && !error && posts.length === 0 && <p>Chưa có bài viết nào.</p>}

        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a href={post.link} target="_blank" rel="noreferrer">
                Xem chi tiết →
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

