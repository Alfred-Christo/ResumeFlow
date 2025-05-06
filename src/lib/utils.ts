import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ResumeData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Uses OpenAI or Genkit backend to generate a professional About Me/summary
export async function generateAboutMe(data: ResumeData): Promise<string> {
  // You can swap this with your own backend or Genkit flow endpoint
  const endpoint = '/api/generate-about-me';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact: data.contact, experience: data.experience, skills: data.skills })
    });
    if (!res.ok) throw new Error('Failed to generate About Me');
    const json = await res.json();
    return json.summary || 'A passionate professional.';
  } catch (e) {
    return 'A passionate professional.';
  }
}
