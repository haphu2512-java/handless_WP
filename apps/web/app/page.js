'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu từ WordPress');
        }
        const data = await response.json();
        setPosts(data);
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
        <p className="eyebrow">Headless WordPress + React</p>
        <h1>WordPress làm backend, React fetch API để hiển thị nội dung</h1>
        <p>
          Trang này gọi API nội bộ của Next.js, sau đó chuyển tiếp sang WordPress REST API.
        </p>
      </section>

      <section className="content">
        {loading && <p>Đang tải bài viết...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && posts.length === 0 && <p>Chưa có bài viết nào.</p>}

        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>{post.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              <a href={post.link} target="_blank" rel="noreferrer">
                Xem chi tiết
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
