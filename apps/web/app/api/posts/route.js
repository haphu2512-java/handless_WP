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
        const posts = await response.json();
        return posts;
      }
    } catch {
      // Bỏ qua lỗi và thử endpoint tiếp theo
    }
  }

  return null;
}

export async function GET() {
  const wordpressUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_URL || 
    process.env.WORDPRESS_URL || 
    'http://wordpress:80'; // Docker compose service name

  try {
    const posts = await fetchPostsFromWordPress(wordpressUrl);

    if (!posts) {
      return NextResponse.json(
        {
          error: 'WordPress backend không sẵn sàng. Vui lòng khởi động Docker containers.',
        },
        { status: 502 }
      );
    }

    // Format posts để trả về frontend
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title?.rendered || 'Không có tiêu đề',
      excerpt: (post.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim().slice(0, 140) + '...',
      content: post.content?.rendered || '',
      link: post.link,
      date: post.date,
      author: post._embedded?.author?.[0]?.name || 'Admin',
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        error: 'Không thể kết nối tới WordPress backend. Chi tiết lỗi: ' + error.message,
      },
      { status: 500 }
    );
  }
}
