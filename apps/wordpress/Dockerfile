FROM wordpress:6.6.2-php8.3-apache

# Enable Apache modules
RUN a2enmod rewrite && a2enmod headers && a2enmod deflate && a2enmod env

# Disable default Apache config
RUN a2dissite 000-default

# Tạo thư mục cho mu-plugins (must-use plugins)
RUN mkdir -p /var/www/html/wp-content/mu-plugins

# Copy mu-plugin để disable WP UI + add CORS
COPY mu-plugins/headless-config.php /var/www/html/wp-content/mu-plugins/

# Copy Apache VirtualHost config
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Enable new config
RUN a2ensite 000-default

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html/wp-content
