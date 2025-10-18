# Stage 1: Build React app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Set environment variables trực tiếp trong Dockerfile
ENV REACT_APP_HIS_MERCHANT_ID=2239141840762336
ENV REACT_APP_HIS_API_URL=http://192.168.2.223:1410/api/Kiosk
ENV REACT_APP_HIS_API_URL_1=http://192.168.2.223:1408/api/Kiosk

# Build React
RUN yarn build

# Stage 2: Serve bằng Nginx
FROM nginx:stable-alpine

# Copy build từ stage trước sang nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
