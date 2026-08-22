# Stage 1: Build React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy application source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Serve React Application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
