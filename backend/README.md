# CarbonKrishi Backend

This is the backend API for the CarbonKrishi Carbon Credit MRV Platform.

## Environment Variables

Create a `.env` file in this directory with the following variables:

```
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://dhawan:dhawan@naba.h7n3inz.mongodb.net/?retryWrites=true&w=majority&appName=Naba

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Optional: For production
NODE_ENV=development
```

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user (farmer or company)
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Farmer Endpoints
- `GET /api/farmer/dashboard` - Get farmer dashboard data
- `POST /api/farmer/practice` - Submit new sustainable practice
- `GET /api/farmer/practices` - Get all practices for a farmer
- `PUT /api/farmer/practice/:practiceId/evidence` - Upload evidence for a practice
- `GET /api/farmer/credits` - Get carbon credits for a farmer

### Company Endpoints
- `GET /api/company/dashboard` - Get company dashboard data
- `PUT /api/company/carbon-footprint` - Update company carbon footprint data
- `GET /api/company/marketplace` - Get available carbon credits in marketplace
- `POST /api/company/purchase` - Purchase carbon credits
- `GET /api/company/purchases` - Get purchased credits history

### Marketplace Endpoints
- `GET /api/marketplace/stats` - Get marketplace statistics
- `GET /api/marketplace/credits` - Get available carbon credits for public view
- `GET /api/marketplace/credit/:id` - Get credit details by ID

### Blockchain Endpoints
- `GET /api/blockchain/registry` - Get blockchain registry entries
- `GET /api/blockchain/transaction/:hash` - Get blockchain transaction details
- `POST /api/blockchain/register` - Register a carbon credit on blockchain (admin only)
- `GET /api/blockchain/verify/:hash` - Verify a blockchain transaction

### Analytics Endpoints
- `GET /api/analytics/platform` - Get platform-wide analytics data
- `GET /api/analytics/farmer/:farmerId` - Get farmer-specific analytics
- `GET /api/analytics/company/:companyId` - Get company-specific analytics

### Admin Endpoints
- `GET /api/admin/dashboard` - Get admin dashboard statistics
- `GET /api/admin/verifications` - Get all pending practice verifications
- `PUT /api/admin/verify-practice/:farmerId/:practiceId` - Verify a sustainable practice
- `GET /api/admin/users` - Get all users
- `GET /api/admin/credits` - Get all carbon credits
