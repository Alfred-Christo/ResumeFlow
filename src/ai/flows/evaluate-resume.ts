// EvaluateResume Flow
'use server';
/**
 * @fileOverview AI agent that evaluates a resume and provides feedback.
 *
 * - evaluateResume - A function that handles the resume evaluation process.
 * - EvaluateResumeInput - The input type for the evaluateResume function.
 * - EvaluateResumeOutput - The return type for the evaluateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EvaluateResumeInput = z.infer<typeof EvaluateResumeInputSchema>;

const EvaluateResumeOutputSchema = z.object({
  feedback: z.string().describe('AI-powered feedback on the resume.'),
});
export type EvaluateResumeOutput = z.infer<typeof EvaluateResumeOutputSchema>;

export async function evaluateResume(input: EvaluateResumeInput): Promise<EvaluateResumeOutput> {
  return evaluateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateResumePrompt',
  input: {schema: EvaluateResumeInputSchema},
  output: {schema: EvaluateResumeOutputSchema},
  prompt: `You are a resume expert. Please provide feedback on the uploaded resume.

Resume: {{media url=resumeDataUri}}`,
});

const evaluateResumeFlow = ai.defineFlow(
  {
    name: 'evaluateResumeFlow',
    inputSchema: EvaluateResumeInputSchema,
    outputSchema: EvaluateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
