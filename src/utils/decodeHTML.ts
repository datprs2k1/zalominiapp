/**
 * Decodes HTML entities in a string to their corresponding characters
 * @param html - The HTML string to decode
 * @returns The decoded string
 */
export function decodeHTML(html: string): string {
  if (!html) {
    return '';
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  console.log(textarea.value, 'AAAAAAAAA');
  return textarea.value;
}
