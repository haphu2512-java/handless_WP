import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function fetchPostsFromWordPress(wordpressUrl) {
  const endpoints = [
    `${wordpressUrl}/wp-json/wp/v2/posts?per_page=6`,
    `${wordpressUrl}/index.php?rest_route=/wp/v2/posts&per_page=6`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60 },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Bỏ qua lỗi và thử endpoint tiếp theo
    }
  }

  return null;
}

export async function GET() {
  const wordpressUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'http://localhost:8000';

  try {
    const posts = await fetchPostsFromWordPress(wordpressUrl);

    if (!posts) {
      return NextResponse.json(
        {
          error:
            'WordPress backend chưa sẵn sàng. Hãy hoàn tất cài đặt WordPress tại http://localhost:8000 trước khi mở trang này.',
        },
        { status: 502 }
      );
    }

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title?.rendered || 'Không có tiêu đề',
      excerpt: (post.excerpt?.rendered || '').replace(/<[^>]*>/g, '').slice(0, 140) + '...',
      link: post.link,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Không thể kết nối tới WordPress backend.',
      },
      { status: 500 }
    );
  }
}
