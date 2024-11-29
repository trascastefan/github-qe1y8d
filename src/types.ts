export interface TagCondition {
  type: 'includes-any' | 'includes-all' | 'excludes-any';
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface View {
  id: string;
  name: string;
  visible: boolean;
  conditions: TagCondition[];
}