FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    wait-for-it

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application code first
COPY . .

# Install dependencies (skip scripts to avoid database connection during build)
RUN composer install --optimize-autoloader --no-interaction --no-scripts

# Create necessary directories and set permissions
RUN mkdir -p var/cache var/log && \
    chmod -R 777 var

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
export APP_DEBUG=1\n\
echo "Waiting for database..."\n\
wait-for-it database:3306 -t 60\n\
echo "Database is ready, running post-install scripts..."\n\
composer run-script post-install-cmd --no-interaction || echo "Post-install scripts completed"\n\
echo "Creating database if not exists..."\n\
php bin/console doctrine:database:create --if-not-exists --no-interaction || echo "Database already exists"\n\
echo "Starting migrations..."\n\
php bin/console doctrine:migrations:migrate --no-interaction || echo "Migration completed"\n\
echo "Loading fixtures..."\n\
php bin/console doctrine:fixtures:load --no-interaction || echo "Fixtures loaded"\n\
echo "Starting PHP server..."\n\
php -S 0.0.0.0:8000 -t public\n\
' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

# Expose port 8000
EXPOSE 8000

# Start with our script
CMD ["/usr/local/bin/start.sh"]