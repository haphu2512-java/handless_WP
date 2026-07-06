# Headless WordPress + Next.js Setup Guide

## Yêu cầu (Requirements)
- ✅ WordPress: Headless CMS (content-only, no UI)
- ✅ API: REST API (GraphQL có thể thêm sau)
- ✅ Frontend: Next.js

## Kiến trúc (Architecture)

```
┌─────────────────────────────────────────┐
│  Browser / Client                       │
│  (Next.js UI)                           │
└────────────┬────────────────────────────┘
             │ HTTP Request
             ▼
┌─────────────────────────────────────────┐
│  Next.js Frontend                       │
│  (apps/web)                             │
│  - page.js (Client Component)           │
│  - /api/posts (API Route)               │
└────────────┬────────────────────────────┘
             │ fetch()
             ▼
┌─────────────────────────────────────────┐
│  WordPress Headless CMS                 │
│  (apps/wordpress)                       │
│  - REST API: /wp-json/wp/v2/posts      │
│  - Custom mu-plugin: Disable UI         │
│  - CORS: Enabled                        │
└────────────┬────────────────────────────┘
             │ Database Query
             ▼
┌─────────────────────────────────────────┐
│  MySQL Database                         │
│  (docker-compose service: db)           │
└─────────────────────────────────────────┘
```

## Cách hoạt động (How it works)

### 1. WordPress đã được cấu hình thành Headless CMS
- **Dockerfile** (`apps/wordpress/Dockerfile`):
  - Build custom WordPress image
  - Enable Apache modules (rewrite, headers)
  - Load mu-plugin (must-use plugin)

- **mu-plugin** (`apps/wordpress/mu-plugins/headless-config.php`):
  - Thêm CORS headers để allow Next.js fetch dữ liệu
  - Redirect homepage → REST API docs
  - Disable WordPress admin bar
  - API status endpoint: `GET /wp-json/wp/v2/status`

### 2. Next.js Frontend
- **Page** (`apps/web/app/page.js`):
  - Client component sử dụng `useEffect` + `fetch()`
  - Gọi `/api/posts` API route
  
- **API Route** (`apps/web/app/api/posts/route.js`):
  - Fetch từ WordPress REST API
  - Format data và return về client
  - Error handling

### 3. Docker Compose
- **db**: MySQL 8.0
- **wordpress**: Custom WordPress image (Headless)
- **phpmyadmin**: Database management UI

## Khởi động (How to run)

### 1. Start Docker containers
```bash
docker-compose up --build
```

Containers sẽ chạy tại:
- WordPress: http://localhost:8000
- WordPress API: http://localhost:8000/wp-json/wp/v2/posts
- WordPress Status: http://localhost:8000/wp-json/wp/v2/status
- phpMyAdmin: http://localhost:8080 (root/root)

### 2. Start Next.js Frontend
```bash
cd apps/web
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Kiểm tra Headless Setup (Verification)

### 1. WordPress REST API
```bash
# Kiểm tra API
curl http://localhost:8000/wp-json/wp/v2/status

# Output:
# {
#   "status": "success",
#   "message": "WordPress Headless CMS is running",
#   "api": "http://localhost:8000/wp-json/",
#   "posts_endpoint": "http://localhost:8000/wp-json/wp/v2/posts",
#   "pages_endpoint": "http://localhost:8000/wp-json/wp/v2/pages"
# }
```

### 2. Get Posts from API
```bash
curl http://localhost:8000/wp-json/wp/v2/posts

# Output: JSON array của posts
```

### 3. Next.js Frontend API
```bash
curl http://localhost:3000/api/posts

# Output: Formatted posts data
```

### 4. Check CORS Headers
```bash
curl -I http://localhost:8000/wp-json/wp/v2/posts

# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## Thêm Posts từ WordPress Admin (Adding Posts)

Mặc dù WordPress UI đã bị disable, bạn vẫn có thể:

### Option 1: Sử dụng WordPress REST API
```bash
# Create a post via REST API
curl -X POST http://localhost:8000/wp-json/wp/v2/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post",
    "status": "publish"
  }'
```

### Option 2: Truy cập phpMyAdmin
- URL: http://localhost:8080
- Username: root
- Password: root

Insert vào table `wp_posts` trực tiếp

### Option 3: Tạm thời enable WordPress UI
Tạo file `.env` trong `apps/wordpress` với:
```
WORDPRESS_DEBUG=true
```
Rồi truy cập http://localhost:8000/wp-admin/

## Cấu hình (Configuration)

### Environment Variables

**apps/web/.env.local**:
```
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8000
WORDPRESS_URL=http://wordpress:80
```

- `NEXT_PUBLIC_WORDPRESS_URL`: Dùng khi browser client fetch (public, hardcoded to localhost:8000)
- `WORDPRESS_URL`: Dùng khi Next.js server-side fetch (Docker network, service name)

### WordPress Configuration

**docker-compose.yml**:
```yaml
wordpress:
  build:
    context: ./apps/wordpress
    dockerfile: Dockerfile
  environment:
    WORDPRESS_DB_HOST: db:3306
    WORDPRESS_DB_NAME: wordpress
    WORDPRESS_TABLE_PREFIX: wp_
```

## Troubleshooting

### 1. WordPress UI vẫn hiện thị
- Check xem `Dockerfile` có load mu-plugin không
- Kiểm tra `/var/www/html/wp-content/mu-plugins/` tồn tại
- Restart container: `docker-compose restart wordpress`

### 2. Next.js không lấy được dữ liệu
- Check WordPress API: `curl http://localhost:8000/wp-json/wp/v2/posts`
- Check CORS headers: `curl -I http://localhost:8000/wp-json/wp/v2/posts`
- Check Next.js API route logs: `docker-compose logs web`

### 3. CORS Error
- Verify mu-plugin headers đã thêm
- Check browser console cho error details
- Restart WordPress container

### 4. Database Connection Error
- Check MySQL running: `docker-compose logs db`
- Check credentials trong docker-compose.yml
- Verify WordPress container connected to db service

## Next Steps

1. **Thêm GraphQL** (Optional)
   - Install `WPGraphQL` plugin
   - Update Next.js queries

2. **Authentication** (Optional)
   - Add JWT authentication
   - Protect content

3. **Performance** (Optional)
   - Add Next.js ISR (Incremental Static Regeneration)
   - Cache headers

4. **Deployment** (Optional)
   - Deploy WordPress to hosting
   - Deploy Next.js to Vercel/Netlify

---

**Status**: ✅ Headless WordPress + Next.js configured correctly
