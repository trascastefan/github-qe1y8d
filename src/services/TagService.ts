import { Tag } from '../types';
import tagData from '../data/tags.json';

// Tag validation configuration
const TAG_VALIDATION = {
  minLength: 2,
  maxLength: 50
};

type TagChangeCallback = (tags: Tag[]) => void;

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class TagService {
  private tags: Tag[] = tagData.tags;
  private subscribers: TagChangeCallback[] = [];

  subscribe(callback: TagChangeCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.tags));
  }

  getAllTags(): Tag[] {
    return this.tags;
  }

  getTagById(id: string): Tag | undefined {
    return this.tags.find(tag => tag.id === id);
  }

  getTagsByIds(ids: string[]): Tag[] {
    return ids
      .map(id => this.getTagById(id))
      .filter((tag): tag is Tag => tag !== undefined);
  }

  validateTagName(name: string): ValidationResult {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return {
        isValid: false,
        error: 'Tag name cannot be empty'
      };
    }

    if (trimmedName.length < TAG_VALIDATION.minLength) {
      return {
        isValid: false,
        error: `Tag name must be at least ${TAG_VALIDATION.minLength} characters`
      };
    }

    if (trimmedName.length > TAG_VALIDATION.maxLength) {
      return {
        isValid: false,
        error: `Tag name cannot exceed ${TAG_VALIDATION.maxLength} characters`
      };
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = this.tags.some(
      tag => tag.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      return {
        isValid: false,
        error: 'A tag with this name already exists'
      };
    }

    return { isValid: true };
  }

  addTag(name: string): Tag | { error: string } {
    const validation = this.validateTagName(name);
    if (!validation.isValid) {
      return { error: validation.error! };
    }

    const newTag: Tag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim()
    };

    this.tags = [...this.tags, newTag];
    this.notifySubscribers();
    return newTag;
  }

  updateTag(updatedTag: Tag): Tag | { error: string } {
    // Find the index of the existing tag
    const tagIndex = this.tags.findIndex(tag => tag.id === updatedTag.id);
    
    if (tagIndex === -1) {
      return { error: 'Tag not found' };
    }

    // Validate the new tag name if it's being changed
    const trimmedName = updatedTag.name.trim();
    if (trimmedName !== this.tags[tagIndex].name) {
      const validation = this.validateTagName(trimmedName);
      if (!validation.isValid) {
        return { error: validation.error! };
      }
    }

    // Create a new array with the updated tag
    this.tags = this.tags.map(tag => 
      tag.id === updatedTag.id 
        ? { 
            ...tag, 
            name: trimmedName,
            llmInstructions: updatedTag.llmInstructions,
            exampleEmails: updatedTag.exampleEmails,
            negativeExampleEmails: updatedTag.negativeExampleEmails
          } 
        : tag
    );

    this.notifySubscribers();
    return updatedTag;
  }

  deleteTag(id: string): boolean {
    const index = this.tags.findIndex(tag => tag.id === id);
    if (index !== -1) {
      this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  searchTags(query: string): Tag[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tags.filter(tag =>
      tag.name.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const tagService = new TagService();
