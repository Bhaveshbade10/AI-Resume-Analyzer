/**
 * LinkedIn analyzer route: analyze pasted LinkedIn profile text
 * POST /api/linkedin-analyze
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { analyzeLinkedIn } = require('../services/groqService');

const router = express.Router();

router.post('/linkedin-analyze', authMiddleware, async (req, res, next) => {
  try {
    const { linkedInText } = req.body;

    if (!linkedInText || linkedInText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: 'LinkedIn profile text is required (paste from your profile)',
      });
    }

    const result = await analyzeLinkedIn(linkedInText.trim());

    res.json({
      success: true,
      analysis: {
        skills: Array.isArray(result.skills) ? result.skills : [],
        personal_branding_score: typeof result.personal_branding_score === 'number'
          ? result.personal_branding_score
          : parseInt(result.personal_branding_score, 10) || 0,
        profile_strength: result.profile_strength || 'Unknown',
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        missing_improvements: Array.isArray(result.missing_improvements) ? result.missing_improvements : [],
        headline_suggestion: result.headline_suggestion || '',
        about_suggestion: result.about_suggestion || '',
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
