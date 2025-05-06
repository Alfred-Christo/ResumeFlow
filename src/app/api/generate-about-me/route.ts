import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { contact, experience, skills } = await req.json();
  const prompt = `Write a professional and concise 'About Me' section for a resume. Use the following details:\n\nName: ${contact.fullName}\nExperience: ${experience?.map(e => e.jobTitle + ' at ' + e.company).join(', ') || 'N/A'}\nSkills: ${skills?.map(s => s.name).join(', ') || 'N/A'}\n`;
  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!geminiRes.ok) throw new Error('Gemini API error');
    const geminiJson = await geminiRes.json();
    const summary = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ summary: '' }, { status: 500 });
  }
}