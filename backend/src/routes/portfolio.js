/**
 * Portfolio analyzer: POST /api/portfolio-analyze
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { analyzePortfolio } = require('../services/groqService');

const router = express.Router();

router.post('/portfolio-analyze', authMiddleware, async (req, res, next) => {
  try {
    const { portfolioText } = req.body;

    if (!portfolioText || portfolioText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: 'Portfolio content is required (paste about, projects, case studies, etc.)',
      });
    }

    const result = await analyzePortfolio(portfolioText.trim());

    res.json({
      success: true,
      analysis: {
        overall_score: typeof result.overall_score === 'number' ? result.overall_score : parseInt(result.overall_score, 10) || 0,
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
        improvements: Array.isArray(result.improvements) ? result.improvements : [],
        content_suggestions: Array.isArray(result.content_suggestions) ? result.content_suggestions : [],
        presentation_tips: Array.isArray(result.presentation_tips) ? result.presentation_tips : [],
        seo_visibility_tips: Array.isArray(result.seo_visibility_tips) ? result.seo_visibility_tips : [],
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
