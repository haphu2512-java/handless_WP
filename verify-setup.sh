#!/bin/bash
# Quick verification script for Headless WordPress + Next.js setup

echo "🔍 Headless WordPress Setup Verification"
echo "========================================"
echo ""

# Check Docker containers
echo "1️⃣ Checking Docker containers..."
if command -v docker &> /dev/null; then
    echo "✅ Docker found"
    echo "   Running containers:"
    docker ps --filter "label=com.docker.compose.project" --format "table {{.Names}}\t{{.Ports}}"
else
    echo "❌ Docker not found"
fi

echo ""
echo "2️⃣ Checking WordPress API..."

# Check WordPress status endpoint
if curl -s http://localhost:8000/wp-json/wp/v2/status | grep -q "success"; then
    echo "✅ WordPress API is running"
    echo "   Status:"
    curl -s http://localhost:8000/wp-json/wp/v2/status | python3 -m json.tool 2>/dev/null || echo "   (Install python3 for formatted output)"
else
    echo "❌ WordPress API not accessible"
    echo "   Make sure: docker-compose up --build"
fi

echo ""
echo "3️⃣ Checking CORS Headers..."
cors_origin=$(curl -s -I http://localhost:8000/wp-json/wp/v2/posts | grep -i "Access-Control-Allow-Origin" | head -1)
if [ ! -z "$cors_origin" ]; then
    echo "✅ CORS enabled"
    echo "   $cors_origin"
else
    echo "❌ CORS headers not found"
fi

echo ""
echo "4️⃣ Checking Database..."
if mysql -h 127.0.0.1 -P 3307 -u wordpress -pwordpress wordpress -e "SELECT COUNT(*) FROM wp_posts;" 2>/dev/null | grep -q "[0-9]"; then
    count=$(mysql -h 127.0.0.1 -P 3307 -u wordpress -pwordpress wordpress -e "SELECT COUNT(*) FROM wp_posts;" 2>/dev/null | tail -1)
    echo "✅ Database connected"
    echo "   Posts count: $count"
else
    echo "⚠️ Cannot connect to database (MySQL client may not be installed)"
fi

echo ""
echo "5️⃣ Checking Services..."
echo ""
echo "   WordPress API:"
echo "   - REST API: http://localhost:8000/wp-json/wp/v2/posts"
echo "   - Status: http://localhost:8000/wp-json/wp/v2/status"
echo ""
echo "   Database Tools:"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - MySQL Port: 3307"
echo ""
echo "   Frontend:"
echo "   - Next.js (when running): http://localhost:3000"
echo "   - Posts API: http://localhost:3000/api/posts"
echo ""

echo "✅ Verification complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Start Next.js: cd apps/web && npm install && npm run dev"
echo "   2. Open http://localhost:3000 in browser"
echo "   3. Check console for any errors"
echo ""
