/**
 * Job match route: compare resume with job description
 * POST /api/match-job
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const { matchJob } = require('../services/groqService');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/match-job', authMiddleware, async (req, res, next) => {
  try {
    const { resumeId, jobDescription, resumeText: rawText } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, error: 'Job description is required' });
    }

    let resumeText = rawText;

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user.id },
      });
      if (!resume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
      }
      resumeText = resume.resumeText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Provide either resumeId or resumeText for matching',
      });
    }

    const result = await matchJob(resumeText, jobDescription.trim());

    const matchPercentage = typeof result.match_percentage === 'number'
      ? result.match_percentage
      : parseFloat(result.match_percentage) || 0;
    const missingSkills = Array.isArray(result.missing_skills) ? result.missing_skills : [];
    const recommendedCourses = Array.isArray(result.recommended_courses) ? result.recommended_courses : [];
    const resumeImprovementTips = Array.isArray(result.resume_improvement_tips)
      ? result.resume_improvement_tips
      : [];

    if (resumeId) {
      await prisma.jobMatch.create({
        data: {
          resumeId,
          jobDescription: jobDescription.trim(),
          matchScore: matchPercentage,
          missingSkills,
          recommendedCourses,
          resumeImprovementTips,
        },
      });
    }

    res.json({
      success: true,
      match: {
        match_percentage: matchPercentage,
        missing_skills: missingSkills,
        recommended_courses: recommendedCourses,
        resume_improvement_tips: resumeImprovementTips,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
