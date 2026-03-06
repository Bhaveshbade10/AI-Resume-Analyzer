/**
 * AI Resume Analyzer - Backend Server
 * Starts HTTP server first so healthcheck passes, then connects to DB
 */

require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Listen first so Railway/healthcheck can reach /health even if DB is not yet configured
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Connect to DB in background (don't block or exit so healthcheck succeeds)
  prisma.$connect()
    .then(() => console.log('✅ Database connected'))
    .catch((e) => console.error('❌ Database connection failed:', e.message));
});
