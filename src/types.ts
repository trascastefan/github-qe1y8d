export interface TagCondition {
  type: 'includes-any' | 'includes-all' | 'excludes-any';
  tags: string[];
}

export interface NegativeExample {
  subject: string;
  preview: string;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  llmInstructions: string[];
  exampleEmails?: string[];
  negativeExamples?: NegativeExample[];
}

export interface View {
  id: string;
  name: string;
  visible: boolean;
  icon: string;
  conditions: TagCondition[];
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  tags: string[];
}