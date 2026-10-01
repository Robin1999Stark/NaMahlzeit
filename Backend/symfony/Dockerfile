FROM php:8.4-apache AS base
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libonig-dev unzip \
    && docker-php-ext-install -j$(nproc) pdo_pgsql mbstring opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini
EXPOSE 80

FROM base AS development
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
ENV APP_ENV=dev APP_DEBUG=1 COMPOSER_ALLOW_SUPERUSER=1
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts
COPY . .
RUN mkdir -p var && chown -R www-data:www-data var

FROM development AS production-build
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --classmap-authoritative

FROM base AS runtime
ENV APP_ENV=prod APP_DEBUG=0
COPY --from=production-build /app/vendor ./vendor
COPY composer.json composer.lock .env ./
COPY bin ./bin
COPY config ./config
COPY public ./public
COPY src ./src
RUN mkdir -p var && chown -R www-data:www-data var
