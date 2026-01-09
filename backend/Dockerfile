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

# Set non-sensitive environment variables
ENV NODE_ENV=production \
    MONGODB_URI="mongodb://mongo:27017/wreckitdb" \
    FRONTEND_URL="http://localhost:3000" \
    PORT=5000

# JWT_SECRET and GEMINI_API_KEY should be provided via env_file in docker-compose.yml
# or as environment variables at runtime - NEVER hardcode secrets in Dockerfile

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
