import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { contact, experience, skills } = await req.json();
  const prompt = `Write a professional and concise 'About Me' section for a resume. Use the following details:\n\nName: ${contact.fullName}\nExperience: ${experience?.map(e => e.jobTitle + ' at ' + e.company).join(', ') || 'N/A'}\nSkills: ${skills?.map(s => s.name).join(', ') || 'N/A'}\n`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes resume summaries.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 120,
      temperature: 0.7,
    });
    const summary = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ summary: '' }, { status: 500 });
  }
}