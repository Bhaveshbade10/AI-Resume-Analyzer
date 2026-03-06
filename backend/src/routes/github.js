/**
 * GitHub profile analyzer: POST /api/github-analyze
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { analyzeGitHub } = require('../services/groqService');

const router = express.Router();

router.post('/github-analyze', authMiddleware, async (req, res, next) => {
  try {
    const { githubText } = req.body;

    if (!githubText || githubText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: 'GitHub profile text is required (paste bio, README, repo descriptions, etc.)',
      });
    }

    const result = await analyzeGitHub(githubText.trim());

    res.json({
      success: true,
      analysis: {
        skills: Array.isArray(result.skills) ? result.skills : [],
        profile_strength: result.profile_strength || 'Unknown',
        profile_score: typeof result.profile_score === 'number' ? result.profile_score : parseInt(result.profile_score, 10) || 0,
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        improvements: Array.isArray(result.improvements) ? result.improvements : [],
        readme_suggestions: Array.isArray(result.readme_suggestions) ? result.readme_suggestions : [],
        pinned_repos_feedback: result.pinned_repos_feedback || '',
        visibility_tips: Array.isArray(result.visibility_tips) ? result.visibility_tips : [],
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
