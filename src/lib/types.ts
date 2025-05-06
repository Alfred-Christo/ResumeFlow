export interface Contact {
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  address?: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  details?: string;
}

export interface Skill {
  name: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
  technologies?: string;
}

export interface ResumeData {
  contact: Contact;
  summary: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
}
