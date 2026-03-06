/**
 * Cover letter generator: POST /api/cover-letter
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const { generateCoverLetter } = require('../services/groqService');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/cover-letter', authMiddleware, async (req, res, next) => {
  try {
    const { resumeId, resumeText: rawText, jobDescription, companyName } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, error: 'Job description is required' });
    }

    let resumeText = rawText;

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user.id },
      });
      if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
      resumeText = resume.resumeText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Provide either resumeId or resumeText',
      });
    }

    const coverLetter = await generateCoverLetter(
      resumeText.trim(),
      jobDescription.trim(),
      (companyName || '').trim()
    );

    res.json({ success: true, coverLetter });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
