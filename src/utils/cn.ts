/**
 * Class Name Utility
 * Utility function for combining and conditionally applying CSS classes
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Combines multiple class names into a single string
 * Filters out falsy values and flattens arrays
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Conditionally applies classes based on a condition
 */
export function conditionalClass(condition: boolean, trueClass: string, falseClass?: string): string {
  return condition ? trueClass : falseClass || '';
}

/**
 * Combines base classes with variant classes
 */
export function variantClass(base: string, variants: Record<string, string>, variant: string): string {
  return cn(base, variants[variant] || '');
}
