import { Tag } from '../types';
import { tagService } from './TagService';
import emailsData from '../data/emails.json';

export const emailService = {
  // Count tag usage based on actual emails
  getTagUsageCounts(): Record<string, number> {
    const tags = tagService.getAllTags();
    
    // Count tag occurrences in emails
    const tagCounts = tags.reduce((counts, tag) => {
      counts[tag.id] = emailsData.emails.filter(email => 
        email.tags.includes(tag.id)
      ).length;
      return counts;
    }, {} as Record<string, number>);

    return tagCounts;
  }
};
