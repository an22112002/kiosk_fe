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
ENV REACT_APP_HIS_API_URL=http://192.168.2.223:1410/api/Kiosk
ENV REACT_APP_HIS_API_URL_1=http://192.168.2.223:1408/api/Kiosk
ENV REACT_APP_CAMERA_NAME=brio
ENV REACT_APP_INSUR_PASS_QR_CODE=insur_pass_qr_code_22112002_nna

# Build React
RUN yarn build

# Stage 2: Serve bằng Nginx
FROM nginx:stable-alpine

# Copy build từ stage trước sang nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
