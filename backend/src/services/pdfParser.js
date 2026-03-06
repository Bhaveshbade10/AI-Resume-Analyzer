/**
 * Extract text from PDF files using pdf-parse
 */

const pdf = require('pdf-parse');
const fs = require('fs');

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return { text: data.text, numPages: data.numpages };
}

module.exports = { extractTextFromPDF };
