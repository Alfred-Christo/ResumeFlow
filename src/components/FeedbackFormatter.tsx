import React from 'react';

interface FeedbackFormatterProps {
  feedback: string;
}

export const FeedbackFormatter: React.FC<FeedbackFormatterProps> = ({ feedback }) => {
  const lines = feedback.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const sectionMatch = line.match(/^\* \*\*(.+?):\*\* (.+)/);
    if (sectionMatch) {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${idx}`}>{listItems}</ul>);
        listItems = [];
      }
      elements.push(
        <li key={`section-${idx}`}> <b>{sectionMatch[1]}:</b> {sectionMatch[2]}</li>
      );
      return;
    }
    if (/^\* /.test(line)) {
      const text = line.replace(/^\* /, '');
      listItems.push(<li key={`li-${idx}`}>{text}</li>);
      return;
    }
    if (line.trim() !== '') {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${idx}`}>{listItems}</ul>);
        listItems = [];
      }
      elements.push(<p key={`p-${idx}`}>{line}</p>);
    }
  });
  if (listItems.length > 0) {
    elements.push(<ul>{listItems}</ul>);
  }
  return <div>{elements}</div>;
};
