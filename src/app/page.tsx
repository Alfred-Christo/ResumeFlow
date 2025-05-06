import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      <section className="text-center space-y-8 pt-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-lg">
          Welcome to <span className="text-primary">ResumeFlow</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Craft professional resumes with ease and get AI-powered feedback to land your dream job.<br/>
          <span className="text-primary font-semibold">ResumeFlow</span> provides the tools you need to create, refine, and evaluate your resume, helping you stand out in today's competitive job market.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg" className="button-glow text-lg px-8 py-4">
            <Link href="/resume-builder">
              Create Your Resume <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
            <Link href="/resume-evaluator">
              Evaluate Your Resume <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="section-divider" />

      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="card-animate shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 dark:bg-card/80">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Resume Builder</CardTitle>
            </div>
            <CardDescription>
              Effortlessly create a polished, professional resume. Our intuitive builder guides you through each section, ensuring you highlight your skills and experiences effectively.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Image
              src="https://picsum.photos/600/400?grayscale&blur=2"
              alt="Resume Builder Preview"
              width={600}
              height={400}
              className="rounded-xl object-cover aspect-[3/2] border border-muted"
              data-ai-hint="resume template"
            />
            <p className="text-base text-muted-foreground">
              Choose from various templates, customize layouts, and input your details step-by-step. Download your resume in PDF format, ready for job applications.
            </p>
            <Button asChild className="w-full button-glow">
              <Link href="/resume-builder">
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-animate shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 dark:bg-card/80">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI Resume Evaluator</CardTitle>
            </div>
            <CardDescription>
              Get instant, actionable feedback on your existing resume. Our AI analyzes your document for clarity, impact, and common mistakes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Image
              src="https://picsum.photos/600/400?grayscale"
              alt="AI Resume Evaluator Preview"
              width={600}
              height={400}
              className="rounded-xl object-cover aspect-[3/2] border border-muted"
              data-ai-hint="resume analysis"
            />
            <p className="text-base text-muted-foreground">
              Upload your resume (PDF or DOCX) and receive a comprehensive evaluation. Improve your chances of getting noticed by recruiters with AI-driven insights.
            </p>
            <Button asChild variant="outline" className="w-full button-glow">
              <Link href="/resume-evaluator">
                Evaluate Now <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
