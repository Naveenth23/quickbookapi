###############################
# Base PHP-FPM 8.2 Image
###############################
FROM php:8.2-fpm AS base

# Prevent interactive tzdata installation
ARG DEBIAN_FRONTEND=noninteractive

# System dependencies (minimum required for Laravel)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl zip unzip nano \
    libzip-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libwebp-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libicu-dev icu-devtools \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        intl \
        zip \
        gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

######################################
# Enable OPCache (Huge Speed Boost)
######################################
RUN docker-php-ext-install opcache

######################################
# Composer (latest stable)
######################################
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

######################################
# Laravel Permissions Setup
######################################
ARG user=www-data

WORKDIR /var/www/html

RUN mkdir -p storage bootstrap/cache \
    && chown -R ${user}:${user} /var/www/html



######################################
# Expose FPM port & run foreground
######################################
EXPOSE 9000
CMD ["php-fpm", "-F"]
