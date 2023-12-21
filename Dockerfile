# Stage 1: Build PostgreSQL image
FROM postgres:latest as postgres_build

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=mealplaner
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=Ptest1234

# Copy the JSON dump file into the container
COPY ./mealplaner_dump.json /docker-entrypoint-initdb.d/

# Expose the PostgreSQL default port
EXPOSE 5432

# Stage 2: Build Django image
FROM python:3.11-slim

# Set environment variables for Django
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Install system dependencies including build tools
RUN apt-get update && \
    apt-get install -y libpq-dev gcc

# Install Pipenv
RUN pip install pipenv

# Copy Pipfile/Pipfile.lock
COPY Backend/Pipfile Backend/Pipfile.lock /app/

# Install Python dependencies
WORKDIR /app
RUN pipenv install --deploy --ignore-pipfile


# Copy Django project files
COPY Backend/backend /app/

# Start Django application
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]