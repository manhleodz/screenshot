# Sử dụng image Node.js chính thức làm base image
FROM node:18

# Cài đặt các phụ thuộc cần thiết cho Puppeteer và Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  lsb-release \
  xdg-utils \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng
COPY . .

# Xây dựng ứng dụng Next.js
RUN npm run build

# Thiết lập biến môi trường để Puppeteer sử dụng Chromium có sẵn trên hệ thống
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Chạy ứng dụng
CMD ["npm", "start"]
