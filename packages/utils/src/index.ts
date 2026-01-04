/**
 * Calculate words per minute (WPM)
 * Standard: 1 word = 5 characters
 * @param words - Number of words typed
 * @param seconds - Time taken in seconds
 * @returns WPM rounded to nearest integer
 */
export function calculateWPM(words: number, seconds: number): number {
  if (seconds <= 0) return 0;
  const minutes = seconds / 60;
  return Math.round(words / minutes);
}

/**
 * Calculate typing accuracy as a percentage
 * @param typedText - The text that was typed
 * @param correctText - The correct/expected text
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(typedText: string, correctText: string): number {
  if (correctText.length === 0) return 100;
  if (typedText.length === 0) return 0;

  let correctChars = 0;
  const minLength = Math.min(typedText.length, correctText.length);

  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === correctText[i]) {
      correctChars++;
    }
  }

  // Penalize for extra characters typed
  const totalChars = Math.max(typedText.length, correctText.length);
  return Math.round((correctChars / totalChars) * 100);
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
