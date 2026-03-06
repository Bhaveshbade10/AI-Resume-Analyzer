/**
 * Resume routes: upload, analyze, get analysis, improvements
 * POST /api/upload-resume, POST /api/analyze-resume, GET /api/analysis/:id, POST /api/improve-resume
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { extractTextFromPDF } = require('../services/pdfParser');
const { analyzeResume, generateImprovements } = require('../services/groqService');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/upload-resume - upload PDF, extract text, store in DB
router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
    }

    const { text } = await extractTextFromPDF(req.file.path);
    if (!text || text.trim().length < 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: 'Could not extract enough text from PDF' });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        resumeText: text.trim(),
        fileName: req.file.originalname,
      },
    });

    // Optional: delete file after storing text to save space
    try { fs.unlinkSync(req.file.path); } catch (_) {}

    res.status(201).json({
      success: true,
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        createdAt: resume.createdAt,
      },
    });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    next(err);
  }
});

// POST /api/analyze-resume - run AI analysis on existing resume (by id) or raw text
router.post('/analyze-resume', authMiddleware, async (req, res, next) => {
  try {
    const { resumeId, resumeText: rawText } = req.body;
    let resumeText = rawText;
    let resumeRecord = null;

    if (resumeId) {
      resumeRecord = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user.id },
      });
      if (!resumeRecord) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
      }
      resumeText = resumeRecord.resumeText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, error: 'No resume text to analyze' });
    }

    const analysis = await analyzeResume(resumeText);

    const score = typeof analysis.resume_score === 'number'
      ? analysis.resume_score
      : parseInt(analysis.resume_score, 10) || 0;

    const skills = Array.isArray(analysis.skills) ? analysis.skills : [];
    const missingSkills = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];
    const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
    const weaknesses = Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [];
    const suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];

    if (resumeRecord) {
      await prisma.resume.update({
        where: { id: resumeRecord.id },
        data: {
          score,
          skills,
          missingSkills,
          strengths,
          weaknesses,
          suggestions,
          experienceLevel: analysis.experience_level || null,
        },
      });
    }

    res.json({
      success: true,
      analysis: {
        skills,
        missing_skills: missingSkills,
        experience_level: analysis.experience_level,
        resume_score: score,
        strengths,
        weaknesses,
        suggestions,
      },
      resumeId: resumeRecord?.id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/analysis/:id - get stored analysis for a resume
router.get('/analysis/:id', authMiddleware, async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    res.json({
      success: true,
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        resumeText: resume.resumeText?.slice(0, 500) + (resume.resumeText?.length > 500 ? '...' : ''),
        score: resume.score,
        skills: resume.skills,
        missingSkills: resume.missingSkills,
        strengths: resume.strengths,
        weaknesses: resume.weaknesses,
        suggestions: resume.suggestions,
        experienceLevel: resume.experienceLevel,
        createdAt: resume.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/resumes - list user's resumes
router.get('/resumes', authMiddleware, async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        score: true,
        skills: true,
        experienceLevel: true,
        createdAt: true,
      },
    });
    res.json({ success: true, resumes });
  } catch (err) {
    next(err);
  }
});

// POST /api/improve-resume - get AI-generated improvements
router.post('/improve-resume', authMiddleware, async (req, res, next) => {
  try {
    const { resumeId, resumeText: rawText } = req.body;
    let resumeText = rawText;

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user.id },
      });
      if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
      resumeText = resume.resumeText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, error: 'No resume text provided' });
    }

    const result = await generateImprovements(resumeText);
    res.json({ success: true, improvements: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
