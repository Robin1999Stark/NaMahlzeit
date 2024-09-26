# Step 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Kopiere nur package.json und package-lock.json für den npm install-Befehl
COPY package.json .
COPY package-lock.json .

RUN npm install

# Kopiere den Rest des Codes nach dem Installieren der Dependencies
COPY . .

# Baue die Anwendung
RUN npm run build

# docker run --rm -v $(pwd)/build:/app/build <image-name>