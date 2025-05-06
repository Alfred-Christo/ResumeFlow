'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Download, PlusCircle, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateResumePDF } from '@/lib/resume-pdf.tsx';
import type { ResumeData } from '@/lib/types';

const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  address: z.string().optional(),
});

const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
});

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution name is required'),
  location: z.string().optional(),
  graduationDate: z.string().min(1, 'Graduation date is required'),
  details: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
});

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Invalid project link').optional().or(z.literal('')),
  technologies: z.string().optional(),
});

const resumeFormSchema = z.object({
  contact: contactSchema,
  summary: z.string().min(1, 'Summary is required'),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

const defaultValues: ResumeFormValues = {
  contact: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    address: '',
  },
  summary: '',
  experience: [{ jobTitle: '', company: '', startDate: '', description: '' }],
  education: [{ degree: '', institution: '', graduationDate: '' }],
  skills: [{ name: '' }],
  projects: [{ name: '', description: '' }],
};

export default function ResumeBuilderPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const onSubmit = async (data: ResumeFormValues) => {
    if (!isClient) return;
    try {
      const pdfBlob = await generateResumePDF(data as ResumeData);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.contact.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: 'Resume Generated!',
        description: 'Your resume has been successfully downloaded.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate resume PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = async () => {
    if (!isClient) return;
    const data = form.getValues();
     // Validate form before generating preview
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form before previewing.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const pdfBlob = await generateResumePDF(data as ResumeData);
      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }
      const url = URL.createObjectURL(pdfBlob);
      setResumePreviewUrl(url);
       toast({
        title: 'Preview Updated',
        description: 'Resume preview has been generated.',
      });
    } catch (error) {
      console.error('Error generating preview PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate resume preview. Please try again.',
        variant: 'destructive',
      });
    }
  };


  if (!isClient) {
    return (
      <div className="space-y-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Your Resume</CardTitle>
          <CardDescription>Fill in your details below to generate a professional resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading resume builder...</p>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full md:w-1/2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">Create Your Resume</CardTitle>
                  <CardDescription>Fill in your details below to generate a professional resume.</CardDescription>
                </CardHeader>
              </Card>

              <Accordion type="multiple" defaultValue={['contact', 'summary']} className="w-full">
                {/* Contact Information */}
                <AccordionItem value="contact">
                  <AccordionTrigger className="text-xl font-semibold">Contact Information</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <FormField control={form.control} name="contact.fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contact.email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="contact.phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="(123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contact.address" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address (Optional)</FormLabel>
                          <FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="contact.linkedin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/johndoe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contact.github" render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Profile URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://github.com/johndoe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="contact.portfolio" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://johndoe.dev" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* Summary */}
                <AccordionItem value="summary">
                  <AccordionTrigger className="text-xl font-semibold">Professional Summary</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <FormField control={form.control} name="summary" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl><Textarea placeholder="A brief overview of your skills and experience..." {...field} rows={5} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>

                {/* Experience */}
                <AccordionItem value="experience">
                  <AccordionTrigger className="text-xl font-semibold">Work Experience</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    {experienceFields.map((field, index) => (
                      <Card key={field.id} className="p-4 space-y-3">
                        <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => (
                          <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                          <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Tech Solutions Inc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (
                          <FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input placeholder="New York, NY" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="month" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                            <FormItem><FormLabel>End Date (Optional)</FormLabel><FormControl><Input type="month" placeholder="Present" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => (
                          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Key responsibilities and achievements..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}><Trash2 className="mr-2 h-4 w-4" /> Remove</Button>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendExperience({ jobTitle: '', company: '', startDate: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education">
                  <AccordionTrigger className="text-xl font-semibold">Education</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    {educationFields.map((field, index) => (
                      <Card key={field.id} className="p-4 space-y-3">
                        <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                          <FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input placeholder="B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                          <FormItem><FormLabel>Institution</FormLabel><FormControl><Input placeholder="University of Example" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => (
                           <FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input placeholder="City, State" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => (
                          <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input type="month" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name={`education.${index}.details`} render={({ field }) => (
                          <FormItem><FormLabel>Details (Optional)</FormLabel><FormControl><Textarea placeholder="GPA, honors, relevant coursework..." {...field} rows={3}/></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}><Trash2 className="mr-2 h-4 w-4" /> Remove</Button>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendEducation({ degree: '', institution: '', graduationDate: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                 <AccordionItem value="skills">
                  <AccordionTrigger className="text-xl font-semibold">Skills</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    {skillFields.map((field, index) => (
                      <Card key={field.id} className="p-4 flex items-center space-x-2">
                        <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (
                          <FormItem className="flex-grow"><FormLabel className="sr-only">Skill Name</FormLabel><FormControl><Input placeholder="JavaScript" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendSkill({ name: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Projects */}
                <AccordionItem value="projects">
                  <AccordionTrigger className="text-xl font-semibold">Projects (Optional)</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    {projectFields.map((field, index) => (
                      <Card key={field.id} className="p-4 space-y-3">
                        <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => (
                          <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input placeholder="Personal Portfolio Website" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name={`projects.${index}.technologies`} render={({ field }) => (
                          <FormItem><FormLabel>Technologies Used (Optional)</FormLabel><FormControl><Input placeholder="React, Next.js, Tailwind CSS" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (
                          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Developed a responsive portfolio..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`projects.${index}.link`} render={({ field }) => (
                          <FormItem><FormLabel>Project Link (Optional)</FormLabel><FormControl><Input placeholder="https://myproject.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeProject(index)}><Trash2 className="mr-2 h-4 w-4" /> Remove</Button>
                      </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendProject({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Project</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator />
              <div className="flex space-x-4">
                <Button type="submit" size="lg">
                  <Download className="mr-2 h-5 w-5" /> Download Resume
                </Button>
                 <Button type="button" variant="outline" size="lg" onClick={handlePreview}>
                  <Eye className="mr-2 h-5 w-5" /> Preview Resume
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="w-full md:w-1/2 sticky top-24 h-[calc(100vh-7rem)]">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                  <CardDescription>This is a live preview of your resume. Click "Preview Resume" to update.</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-8rem)]">
                  {resumePreviewUrl ? (
                    <iframe src={resumePreviewUrl} className="w-full h-full border rounded-md" title="Resume Preview" />
                  ) : (
                    <div className="w-full h-full border rounded-md flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">Click "Preview Resume" to see your document here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
