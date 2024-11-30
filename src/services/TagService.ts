import { Tag } from '../types';
import tagData from '../data/tags.json';

type TagChangeCallback = (tags: Tag[]) => void;

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

  addTag(name: string): Tag {
    const newTag: Tag = {
      id: `tag${Date.now()}`,
      name
    };
    this.tags = [...this.tags, newTag];
    this.notifySubscribers();
    return newTag;
  }

  updateTag(id: string, name: string): Tag | undefined {
    const tagIndex = this.tags.findIndex(tag => tag.id === id);
    if (tagIndex !== -1) {
      const updatedTag = { ...this.tags[tagIndex], name };
      this.tags = [
        ...this.tags.slice(0, tagIndex),
        updatedTag,
        ...this.tags.slice(tagIndex + 1)
      ];
      this.notifySubscribers();
      return updatedTag;
    }
    return undefined;
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
