# Environment Setup

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/spendahead
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendahead?retryWrites=true&w=majority

# JWT Configuration
# ⚠️ CRITICAL SECURITY: JWT_SECRET is required and must be strong!
# - Minimum length: 32 characters
# - Must be unique per deployment
# - Never commit the actual secret to version control
# - Generate a strong secret using one of these methods:
#   - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
#   - openssl rand -hex 32
#   - python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET=REPLACE_WITH_STRONG_RANDOM_SECRET_AT_LEAST_32_CHARACTERS_LONG
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth Configuration (Optional)
# Get credentials from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Quick Setup

1. Copy `.env.example` to `.env` in the `backend` folder:
   ```bash
   cp .env.example .env
   ```

2. Update `MONGODB_URI` with your MongoDB connection string

3. **CRITICAL**: Generate and set a strong `JWT_SECRET`:
   ```bash
   # Generate a secure 32-byte hex secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste it as your `JWT_SECRET` value in `.env`

4. ⚠️ **Security Warning**: 
   - Never commit your `.env` file to version control
   - Each deployment must have a unique `JWT_SECRET`
   - In production, the application will fail to start if `JWT_SECRET` is missing or weak

5. Save the file
