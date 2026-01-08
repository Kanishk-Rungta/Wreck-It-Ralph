# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend code
COPY . .

# Disable ESLint during build (prevents build failure)
ENV NEXT_DISABLE_ESLINT=1

# API base URL for frontend → backend service
ENV NEXT_PUBLIC_API_BASE_URL=http://backend:5000

# Environment variables for frontend
ENV GEMINI_API_KEY="YOUR_REAL_GEMINI_API_KEY" \
    MONGODB_URI="mongodb://mongo:27017/wreckitdb" \
    NODE_ENV=production

# Build Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
