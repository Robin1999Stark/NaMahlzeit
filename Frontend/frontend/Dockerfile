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

# Step 2: Serve the application
FROM docker.io/nginx:alpine


COPY nginx.conf /etc/nginx/nginx.conf

# Kopiere die gebauten Dateien in das Nginx-Verzeichnis
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx auf Port 5000 aussetzen
EXPOSE 80

# Nginx im Vordergrund ausführen
CMD ["nginx", "-g", "daemon off;"]