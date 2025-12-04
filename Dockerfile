# Use Node.js 20.11.1 base image
FROM node:20.11.1-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm uninstall bcrypt --legacy-peer-deps
RUN npm install bcrypt --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Generate Prisma Client code
RUN npx prisma generate
COPY prisma ./node_modules/@prisma/client

RUN echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /app/src/models/firebase/firebase-config.json

# Command to run the app
CMD [  "npm", "run", "start:migrate:prod" ]