'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Sparkles, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { evaluateResume } from '@/ai/flows/evaluate-resume';
import type { EvaluateResumeInput } from '@/ai/flows/evaluate-resume';

export default function ResumeEvaluatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      // Supported MIME types: PDF, DOCX, TXT
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
        setFile(null);
        setFileName('');
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF, DOCX, or TXT file.',
          variant: 'destructive',
        });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Maximum size is 5MB.');
        setFile(null);
        setFileName('');
        toast({
          title: 'File Too Large',
          description: 'Maximum file size is 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      setFeedback(null); // Clear previous feedback
    }
  };

  const handleSubmit = async () => {
    if (!file || !isClient) {
      setError('Please select a file first.');
      toast({
        title: 'No File Selected',
        description: 'Please select a resume file to evaluate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const input: EvaluateResumeInput = {
          resumeDataUri: base64data,
        };

        const result = await evaluateResume(input);
        setFeedback(result.feedback);
        toast({
          title: 'Evaluation Complete!',
          description: 'Your resume feedback is ready.',
        });
      };
      reader.onerror = () => {
        throw new Error('Failed to read file.');
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Evaluation failed: ${errorMessage}`);
      toast({
        title: 'Evaluation Failed',
        description: `An error occurred during evaluation: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isClient) {
    return (
      <div className="space-y-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AI Resume Evaluator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Upload your resume to get AI-powered feedback and suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading AI Resume Evaluator...</p>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-3xl animate-fade-in">
      <Card className="card-animate shadow-xl hover:shadow-2xl border-0 bg-white/80 dark:bg-card/80">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4 animate-bounce-in">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">AI Resume Evaluator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Upload your resume (PDF, DOCX, or TXT - max 5MB) and let our AI provide valuable insights to help you improve it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-upload" className="text-base font-medium">Upload Your Resume</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="resume-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
              <Button asChild variant="outline" className="flex-grow cursor-pointer button-glow">
                <label htmlFor="resume-upload" className="flex items-center justify-center w-full">
                  <UploadCloud className="mr-2 h-5 w-5" />
                  {fileName ? 'Change File' : 'Choose File'}
                </label>
              </Button>
            </div>
            {fileName && (
              <div className="flex items-center text-sm text-muted-foreground p-2 border rounded-md bg-muted/50 animate-fade-in">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Selected: {fileName}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="w-full text-lg py-6 button-glow"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-6 w-6" />
            )}
            {isLoading ? 'Evaluating...' : 'Evaluate Resume'}
          </Button>

          {feedback && (
            <Card className="mt-8 bg-background shadow-inner card-animate animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Evaluation Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap p-4 border rounded-md bg-muted/30 animate-fade-in">
                  {feedback}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// Helper Label component if not already globally available
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className={`block text-sm font-medium text-foreground ${props.className || ''}`} />
);
