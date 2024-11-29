import { Email, View, TagCondition } from '../types';

export function filterEmailsByConditions(email: Email, conditions: TagCondition[]): boolean {
  // If there are no conditions or no tags in conditions, return false
  if (!conditions.length || conditions.every(c => !c.tags.length)) {
    return false;
  }

  // Check each condition independently
  return conditions.every(condition => {
    const emailTags = new Set(email.tags);
    
    // If condition has no tags, treat it as always true
    if (!condition.tags.length) {
      return true;
    }
    
    switch (condition.type) {
      case 'includes-any':
        // Match if ANY of the condition tags are present in email tags (OR operation)
        return condition.tags.some(tag => emailTags.has(tag));
      
      case 'includes-all':
        // Match if ALL of the condition tags are present in email tags (AND operation)
        return condition.tags.every(tag => emailTags.has(tag));
      
      case 'excludes-any':
        // Match if NONE of the condition tags are present in email tags (NOT ANY operation)
        return !condition.tags.some(tag => emailTags.has(tag));
      
      default:
        return false;
    }
  });
}

export function getEmailCount(emails: Email[], view: View): number {
  return emails.filter(email => filterEmailsByConditions(email, view.conditions)).length;
}