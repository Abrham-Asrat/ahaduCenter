require('dotenv').config();

const REQUIRED_VARS = [
  'PORT', 'MONGO_URI', 'JWT_SECRET',
  'CLIENT_ORIGIN', 'OVERDUE_FEE_PER_DAY', 'RESERVATION_FEE',
];
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[startup] Missing required env variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = require('./src/app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
