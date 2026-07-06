<?php
/**
 * Plugin Name: Headless WordPress Configuration
 * Plugin URI: https://example.com
 * Description: Configure WordPress for headless setup (content-only, no UI)
 * Version: 1.0.0
 * Author: Dev Team
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handle preflight requests (CORS)
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 3600');
    http_response_code(200);
    exit();
}

/**
 * Add CORS headers to all REST API responses
 */
add_filter('rest_pre_serve_request', function($served) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    return $served;
});

/**
 * Add CORS headers globally
 */
add_action('send_headers', function () {
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/') !== false || strpos($_SERVER['REQUEST_URI'], 'rest_route=') !== false) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
});

/**
 * Disable WordPress admin bar for headless
 */
add_action('after_setup_theme', function () {
    show_admin_bar(false);
});

/**
 * Redirect homepage to REST API documentation (optional)
 */
add_action('template_redirect', function () {
    if (is_front_page() && !is_admin() && !preg_match('/wp-json|rest_route/', $_SERVER['REQUEST_URI'])) {
        // Optionally redirect to API docs
        // wp_redirect(home_url('/wp-json/'));
        // exit;
    }
});

/**
 * Disable theme and plugin editing from admin
 */
if (!defined('DISALLOW_FILE_MODS')) {
    define('DISALLOW_FILE_MODS', true);
}

/**
 * Hide WordPress version for security
 */
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

/**
 * Enable REST API for posts and pages
 */
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/status', [
        'methods' => 'GET',
        'callback' => function () {
            return [
                'status' => 'success',
                'message' => 'WordPress Headless CMS is running',
                'api' => home_url('/wp-json/'),
                'posts_endpoint' => home_url('/wp-json/wp/v2/posts'),
                'pages_endpoint' => home_url('/wp-json/wp/v2/pages'),
                'wordpress_version' => get_bloginfo('version'),
            ];
        },
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Log REST API requests for debugging
 */
add_action('rest_api_init', function () {
    error_log('REST API initialized at ' . home_url('/wp-json/'));
}, 999);
?>
