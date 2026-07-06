# 🚀 Headless WordPress + Next.js - Quick Start

## ✅ Yêu Cầu Đã Hoàn Thành

- ✅ **WordPress**: Chuyển thành Headless CMS (content-only, no UI)
- ✅ **API**: REST API configured with CORS
- ✅ **Frontend**: Next.js integrated

## 📦 Các File Được Tạo/Cập Nhật

```
apps/wordpress/
├── Dockerfile (NEW) - Custom WordPress image
└── mu-plugins/ (NEW)
    └── headless-config.php - Plugin để disable UI + add CORS

apps/web/
├── .env.local (NEW) - Environment configuration
├── app/page.js (UPDATED) - Client component
└── app/api/posts/route.js (UPDATED) - API route

Root:
├── docker-compose.yml (UPDATED) - Use custom WordPress image
├── SETUP.md (NEW) - Comprehensive guide
├── verify-setup.sh (NEW) - Bash verification
└── verify-setup.ps1 (NEW) - PowerShell verification
```

## 🏃 Khởi Động Nhanh (5 phút)

### Step 1: Start Docker
```bash
# Từ thư mục root
docker-compose up --build
```

**Chờ đến khi thấy**:
```
wordpress-app | Ready to accept connections
```

### Step 2: Kiểm tra WordPress API
```bash
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File verify-setup.ps1

# Hoặc curl
curl http://localhost:8000/wp-json/wp/v2/status
```

**Output** (nếu thành công):
```json
{
  "status": "success",
  "message": "WordPress Headless CMS is running",
  "api": "http://localhost:8000/wp-json/",
  "posts_endpoint": "http://localhost:8000/wp-json/wp/v2/posts"
}
```

### Step 3: Start Next.js
```bash
# Terminal mới
cd apps/web
npm install
npm run dev
```

### Step 4: Mở Browser
- Frontend: http://localhost:3000 ✅
- WordPress API: http://localhost:8000/wp-json/wp/v2/posts
- phpMyAdmin: http://localhost:8080 (root/root)

## 🧪 Kiểm Tra CORS

```bash
curl -I http://localhost:8000/wp-json/wp/v2/posts
```

Nên thấy:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## 📝 Thêm Test Posts

### Via REST API:
```bash
curl -X POST http://localhost:8000/wp-json/wp/v2/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Headless Post",
    "content": "This is a test post from REST API",
    "status": "publish"
  }'
```

### Via phpMyAdmin:
1. Open: http://localhost:8080
2. Login: root / root
3. Go to `wp_posts` table
4. Insert new row with:
   - post_title: "Test Post"
   - post_content: "Test content"
   - post_status: "publish"

## 🔧 Cấu Hình

### Environment Variables (apps/web/.env.local)
```
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8000
WORDPRESS_URL=http://wordpress:80
```

### WordPress Headless Plugin (apps/wordpress/mu-plugins/headless-config.php)
- Tự động load khi WordPress start
- Không cần activate trong admin
- Xóa để disable headless mode

## ❌ Troubleshooting

### Docker containers không chạy
```bash
docker-compose up --build
docker-compose logs wordpress
```

### WordPress API không accessible
```bash
# Check container
docker ps

# Check logs
docker-compose logs wordpress

# Restart
docker-compose restart wordpress
```

### CORS error trong browser
- Kiểm tra Firefox console / Chrome DevTools
- Verify `/wp-json/wp/v2/status` accessible
- Restart WordPress container

### Next.js không lấy được posts
```bash
# Check API route
curl http://localhost:3000/api/posts

# Check logs
npm run dev  # sẽ show logs
```

## 📚 Tài Liệu Chi Tiết

- **SETUP.md**: Full documentation + architecture
- **apps/wordpress/README.md**: WordPress headless guide
- **verify-setup.ps1**: Automated verification (Windows)
- **verify-setup.sh**: Automated verification (Mac/Linux)

## 🎯 Kiến Trúc

```
Browser (3000)
    ↓
Next.js Frontend
    ├─ page.js (React Component)
    └─ /api/posts (API Route)
    ↓
WordPress API (8000)
    └─ /wp-json/wp/v2/posts
    ↓
MySQL Database (3307)
```

## ⚡ Tiếp Theo (Optional)

- [ ] Add GraphQL endpoint (WPGraphQL plugin)
- [ ] Add authentication (JWT)
- [ ] Add ISR (Incremental Static Regeneration) to Next.js
- [ ] Deploy to production

---

**Status**: ✅ **Headless WordPress + Next.js đã cấu hình xong!**

Bây giờ chạy:
```bash
docker-compose up --build
# Ở terminal khác:
cd apps/web && npm install && npm run dev
```

Rồi mở http://localhost:3000 🎉
