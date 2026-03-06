/**
 * Groq API integration for resume analysis, job matching, and improvements
 * Uses LLaMA or Mixtral models via Groq
 */

const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.3-70b-versatile'; // replacement for deprecated llama-3.1-70b-versatile

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
function parseJSONResponse(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const raw = (match[1] || text).trim();
  return JSON.parse(raw);
}

/**
 * Analyze resume and return structured JSON
 */
async function analyzeResume(resumeText) {
  const prompt = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist.
Analyze the following resume text and return ONLY a valid JSON object with no other text.
Use this exact structure (use arrays for list fields):

{
  "skills": ["skill1", "skill2"],
  "missing_skills": ["skill that would strengthen the resume"],
  "experience_level": "Entry Level | Mid Level | Senior | Executive",
  "resume_score": number between 0 and 100 (ATS compatibility and overall quality),
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["actionable suggestion1", "suggestion2"]
}

Resume text:
---
${resumeText.slice(0, 12000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

/**
 * Match resume against job description and return match result
 */
async function matchJob(resumeText, jobDescription) {
  const prompt = `You are a career coach and job matching expert.
Given the resume and job description below, return ONLY a valid JSON object:

{
  "match_percentage": number 0-100,
  "missing_skills": ["skill1", "skill2"],
  "recommended_courses": ["course or certification 1", "2"],
  "resume_improvement_tips": ["tip1", "tip2"]
}

Resume:
---
${resumeText.slice(0, 8000)}
---

Job Description:
---
${jobDescription.slice(0, 6000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

/**
 * Generate resume improvements: bullet points, summary, action verbs, ATS tips
 */
async function generateImprovements(resumeText) {
  const prompt = `You are an expert resume writer and ATS specialist.
For the following resume text, return ONLY a valid JSON object:

{
  "improved_bullet_points": ["Improved bullet 1", "Improved bullet 2", "..."],
  "improved_summary": "A strong 2-3 sentence professional summary",
  "action_verbs": ["verb1", "verb2", "verb3", "..."],
  "ats_tips": ["ATS tip 1", "ATS tip 2", "..."]
}

Resume text:
---
${resumeText.slice(0, 10000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

/**
 * Analyze LinkedIn profile text
 */
async function analyzeLinkedIn(linkedInText) {
  const prompt = `You are a LinkedIn and personal branding expert.
Analyze the following LinkedIn profile text and return ONLY a valid JSON object:

{
  "skills": ["skill1", "skill2"],
  "personal_branding_score": number 0-100,
  "profile_strength": "Weak | Moderate | Strong | Excellent",
  "strengths": ["strength1", "strength2"],
  "missing_improvements": ["improvement1", "improvement2"],
  "headline_suggestion": "Suggested headline",
  "about_suggestion": "Brief suggestion for About section"
}

LinkedIn profile text:
---
${linkedInText.slice(0, 10000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

/**
 * Generate a tailored cover letter from resume + job description
 */
async function generateCoverLetter(resumeText, jobDescription, companyName = '') {
  const company = companyName ? `Company: ${companyName}\n\n` : '';
  const prompt = `You are an expert career writer. Write a professional, tailored cover letter based on the resume and job description below.
${company}Do NOT include placeholders like [Your Name] or [Date]. Write the full letter ready to copy-paste, with a suitable greeting and sign-off.
Keep it to 3-4 short paragraphs. Be specific and match the candidate's experience to the job requirements.

Resume:
---
${resumeText.slice(0, 8000)}
---

Job Description:
---
${jobDescription.slice(0, 6000)}
---

Return ONLY the cover letter text, no JSON, no "Cover Letter:" label. Start directly with the greeting (e.g. Dear Hiring Manager,).`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1024,
  });

  return (completion.choices[0]?.message?.content || '').trim();
}

/**
 * Analyze GitHub profile text (bio, repos, readme, etc.)
 */
async function analyzeGitHub(profileText) {
  const prompt = `You are a developer advocate and tech hiring expert. Analyze the following GitHub profile text and return ONLY a valid JSON object:

{
  "skills": ["skill1", "skill2"],
  "profile_strength": "Weak | Moderate | Strong | Excellent",
  "profile_score": number 0-100,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "readme_suggestions": ["suggestion for README"],
  "pinned_repos_feedback": "Brief feedback on pinned repos or projects",
  "visibility_tips": ["tip to improve profile visibility to recruiters"]
}

GitHub profile text (bio, README, repo descriptions, etc.):
---
${profileText.slice(0, 12000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

/**
 * Analyze portfolio text (projects, about, links)
 */
async function analyzePortfolio(portfolioText) {
  const prompt = `You are a design and career expert. Analyze the following portfolio content (projects, about, case studies, links) and return ONLY a valid JSON object:

{
  "overall_score": number 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvements": ["actionable improvement1", "improvement2"],
  "content_suggestions": ["suggestion for content or copy"],
  "presentation_tips": ["tip for better presentation or layout"],
  "seo_visibility_tips": ["tip to improve discoverability"]
}

Portfolio text:
---
${portfolioText.slice(0, 12000)}
---

Return only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return parseJSONResponse(content);
}

module.exports = {
  analyzeResume,
  matchJob,
  generateImprovements,
  analyzeLinkedIn,
  generateCoverLetter,
  analyzeGitHub,
  analyzePortfolio,
};
