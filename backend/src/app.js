/**
 * Express app setup: CORS, JSON, routes, error handler
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const jobMatchRoutes = require('./routes/jobMatch');
const linkedinRoutes = require('./routes/linkedin');
const coverLetterRoutes = require('./routes/coverLetter');
const githubRoutes = require('./routes/github');
const portfolioRoutes = require('./routes/portfolio');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// CORS - allow frontend origin
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Serve uploaded files (optional, for viewing)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', resumeRoutes);   // /api/upload-resume, /api/analyze-resume, /api/analysis/:id
app.use('/api', jobMatchRoutes); // /api/match-job
app.use('/api', linkedinRoutes); // /api/linkedin-analyze
app.use('/api', coverLetterRoutes); // /api/cover-letter
app.use('/api', githubRoutes); // /api/github-analyze
app.use('/api', portfolioRoutes); // /api/portfolio-analyze

// Health check for deployment
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

module.exports = app;
