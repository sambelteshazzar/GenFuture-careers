### Frontend Dockerfile (Vite build -> Nginx static)
FROM node:18-alpine AS builder
WORKDIR /app

# install deps and build
COPY package*.json ./
COPY .npmrc* ./ 2>/dev/null || true
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
