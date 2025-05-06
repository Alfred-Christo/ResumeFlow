'use client'; // This file will contain client-side PDF generation logic

import { pdf, Document, Page, Text, View, StyleSheet, Font, Link as PdfLink } from '@react-pdf/renderer';
import { generateAboutMe } from './utils';
import type { ResumeData, Experience, Education, Project, Skill } from './types';

// Register Inter font (ensure you have the .ttf files)
// For simplicity, we'll use default fonts. In a real app, you'd host/include font files.
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: '/fonts/Inter-Regular.ttf' },
//     { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', // Fallback font
    fontSize: 10,
    padding: '0.75in', // Standard resume margin
    lineHeight: 1.4,
    color: '#333333', // Dark Gray for text
    backgroundColor: '#F5F5F5', // Neutral Gray for background
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080', // Teal accent
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 9,
    color: '#555555',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  contactLink: {
    textDecoration: 'none',
    color: '#008080', // Teal for links
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008080', // Teal accent
    marginBottom: 8,
    marginTop: 15,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  contentBlock: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  dates: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    marginLeft: 10, // Indent bullet points or description
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    marginRight: 5,
  },
  itemContent: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillBadge: {
    backgroundColor: '#E0E0E0', // Light gray for skill badges
    color: '#333333',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 9,
  },
  summary: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'justify',
  }
});

const ResumeDocument: React.FC<{ data: ResumeData }> = ({ data }) => (
  <Document title={`${data.contact.fullName} - Resume`} author={data.contact.fullName}>
    <Page size="LETTER" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{data.contact.fullName}</Text>
        <View style={styles.contactInfo}>
          {data.contact.email && <PdfLink style={styles.contactLink} src={`mailto:${data.contact.email}`}>{data.contact.email}</PdfLink>}
          {data.contact.phone && <Text> | {data.contact.phone}</Text>}
          {data.contact.address && <Text> | {data.contact.address}</Text>}
        </View>
        <View style={styles.contactInfo}>
          {data.contact.linkedin && <PdfLink style={styles.contactLink} src={data.contact.linkedin}>LinkedIn</PdfLink>}
          {data.contact.github && <Text>{data.contact.linkedin ? ' | ' : ''}<PdfLink style={styles.contactLink} src={data.contact.github}>GitHub</PdfLink></Text>}
          {data.contact.portfolio && <Text>{(data.contact.linkedin || data.contact.github) ? ' | ' : ''}<PdfLink style={styles.contactLink} src={data.contact.portfolio}>Portfolio</PdfLink></Text>}
        </View>
      </View>

      {/* Summary */}
      {data.summary && (
        <View>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.contentBlock}>
              <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
              <Text style={styles.company}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</Text>
              <Text style={styles.dates}>
                {exp.startDate} - {exp.endDate || 'Present'}
              </Text>
              {exp.description.split('\n').map((line, i) => (
                 <View key={i} style={styles.listItem}>
                   <Text style={styles.bulletPoint}>•</Text>
                   <Text style={styles.itemContent}>{line}</Text>
                 </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.contentBlock}>
              <Text style={styles.jobTitle}>{edu.degree}</Text>
              <Text style={styles.company}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
              <Text style={styles.dates}>Graduated: {edu.graduationDate}</Text>
              {edu.details && edu.details.split('\n').map((line, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.itemContent}>{line}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skillBadge}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={styles.contentBlock}>
              <Text style={styles.jobTitle}>{project.name}</Text>
              {project.technologies && <Text style={styles.company}>Technologies: {project.technologies}</Text>}
              {project.description.split('\n').map((line, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.itemContent}>{line}</Text>
                </View>
              ))}
              {project.link && <PdfLink style={{...styles.contactLink, fontSize: 9, marginTop: 2}} src={project.link}>Project Link</PdfLink>}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const generateResumePDF = async (data: ResumeData): Promise<Blob> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation can only occur in the browser.');
  }
  // Defensive: Ensure required fields exist
  if (!data.contact || typeof data.contact !== 'object') {
    throw new Error('Resume data is missing contact information.');
  }
  if (!data.contact.fullName || !data.contact.email) {
    throw new Error('Full name and email are required in contact information.');
  }
  // Ensure all arrays are defined
  const safeData: ResumeData = {
    ...data,
    experience: data.experience ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    projects: data.projects ?? [],
  };
  // If summary is missing, generate it with AI
  if (!safeData.summary || safeData.summary.trim() === '') {
    safeData.summary = await generateAboutMe(safeData);
  }
  const blob = await pdf(<ResumeDocument data={safeData} />).toBlob();
  return blob;
};
