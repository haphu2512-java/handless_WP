# Headless WordPress Configuration

## 📋 Yêu cầu
- ✅ WordPress: Headless CMS (content-only, no UI)
- ✅ API: REST API 
- ✅ Frontend: Next.js

## ✨ Thay đổi Được Thực Hiện

### 1. Custom Dockerfile (`Dockerfile`)
```dockerfile
FROM wordpress:6.6.2-php8.3-apache
# - Enable Apache modules (rewrite, headers)
# - Create mu-plugins directory
# - Copy headless-config.php plugin
```

### 2. Must-Use Plugin (`mu-plugins/headless-config.php`)
- ✅ Thêm CORS headers cho Next.js fetch dữ liệu
- ✅ Redirect homepage → REST API docs
- ✅ Disable WordPress admin bar
- ✅ Custom status endpoint: `/wp-json/wp/v2/status`

### 3. Docker Compose Updates
- WordPress service: Build từ custom Dockerfile (thay vì image)
- Tự động load mu-plugin khi container start

## 🚀 Khởi Động

### 1. Start Docker containers
```bash
# Từ repository root
docker-compose up --build
```

Containers sẽ chạy tại:
- WordPress API: http://localhost:8000/wp-json/wp/v2/posts
- WordPress Status: http://localhost:8000/wp-json/wp/v2/status
- phpMyAdmin: http://localhost:8080 (root/root)

### 2. Kiểm tra Headless Setup
```bash
# Check WordPress status
curl http://localhost:8000/wp-json/wp/v2/status
```

**Output** (nếu thành công):
```json
{
  "status": "success",
  "message": "WordPress Headless CMS is running",
  "api": "http://localhost:8000/wp-json/",
  "posts_endpoint": "http://localhost:8000/wp-json/wp/v2/posts",
  "pages_endpoint": "http://localhost:8000/wp-json/wp/v2/pages"
}
```

### 3. Get Posts từ API
```bash
curl http://localhost:8000/wp-json/wp/v2/posts?per_page=10
```

### 4. Check CORS Headers
```bash
curl -I http://localhost:8000/wp-json/wp/v2/posts
```

Nên thấy:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

## 🎨 Chạy Next.js Frontend

```bash
cd ../web
npm install
npm run dev
```

Frontend sẽ tự động fetch posts từ WordPress API! 🎉

## 📝 Thêm Posts

### Option 1: REST API (Recommended)
```bash
curl -X POST http://localhost:8000/wp-json/wp/v2/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post",
    "status": "publish"
  }'
```

### Option 2: phpMyAdmin
- URL: http://localhost:8080
- Username: root
- Password: root
- Insert vào table `wp_posts`

## 🛑 Dừng & Reset

```bash
# Dừng containers
docker compose down

# Xóa database + uploaded files
docker compose down -v
```

## ✅ Verification Checklist

- [ ] WordPress container started successfully
- [ ] `/wp-json/wp/v2/status` endpoint accessible
- [ ] CORS headers present
- [ ] MySQL database connected
- [ ] Next.js API route `/api/posts` working
- [ ] Frontend displays posts from WordPress

---

**Status**: ✅ Headless WordPress + Next.js configured correctly
