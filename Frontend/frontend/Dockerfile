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

FROM nginx:stable-alpine
COPY --from=build ./build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]