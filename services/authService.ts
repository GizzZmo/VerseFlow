import { MOCK_CURRENT_USER } from '../constants';
import { CurrentUser } from '../types';

/**
 * Simulates a sign-in process with SoundCloud.
 * In a real application, this would involve an OAuth 2.1 flow.
 * @returns A promise that resolves with the mock current user data.
 */
export const signInWithSoundCloud = (): Promise<CurrentUser> => {
  console.log("Simulating SoundCloud sign-in...");
  return new Promise((resolve) => {
    // Simulate network delay for realism
    setTimeout(() => {
      console.log("Signed in as:", MOCK_CURRENT_USER.name);
      resolve(MOCK_CURRENT_USER);
    }, 500); 
  });
};
