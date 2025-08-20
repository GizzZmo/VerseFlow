import { Beat, CollaborationProject } from '../types';

/**
 * Filter beats based on search term, mood, and key
 */
export const filterBeats = (
  beats: Beat[], 
  searchTerm: string, 
  selectedMood: string, 
  selectedKey: string
): Beat[] => {
  return beats.filter(beat => {
    const matchesSearch = beat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         beat.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || beat.mood === selectedMood;
    const matchesKey = selectedKey === 'all' || beat.key === selectedKey;
    return matchesSearch && matchesMood && matchesKey;
  });
};

/**
 * Filter projects based on search term
 */
export const filterProjects = (projects: CollaborationProject[], searchTerm: string): CollaborationProject[] => {
  const lowercasedTerm = searchTerm.toLowerCase();
  return projects.filter(project => {
    const matchesTitle = project.title.toLowerCase().includes(lowercasedTerm);
    const matchesDescription = project.description.toLowerCase().includes(lowercasedTerm);
    const matchesSkills = project.requiredSkills.some(skill => skill.toLowerCase().includes(lowercasedTerm));
    
    return matchesTitle || matchesDescription || matchesSkills;
  });
};

/**
 * Generate a simple unique ID for demonstration purposes
 */
export const generateId = (): number => Math.round(Math.random() * 1_000_000_000);

/**
 * Debounce function to limit the frequency of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};