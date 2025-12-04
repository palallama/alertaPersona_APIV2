# Use Node.js 20 LTS Alpine base image
FROM node:20-alpine

# Install dependencies required for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --legacy-peer-deps --omit=dev

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:migrate:prod"]