# Use Node.js 20 slim for backend
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=prod

# Copy all backend code
COPY . .

# Bake in environment variables directly into container
ENV NODE_ENV=production \
    MONGODB_URI="mongodb://mongo:27017/wreckitdb" \
    JWT_SECRET="YOUR_REAL_JWT_SECRET" \
    FRONTEND_URL="http://localhost:3000" \
    GEMINI_API_KEY="YOUR_REAL_GEMINI_API_KEY" \
    PORT=5000

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
