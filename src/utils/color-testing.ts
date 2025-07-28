/**
 * Color Testing and Validation Utilities
 * Automated tools to ensure color system compliance and accessibility
 */

import { COLOR_TOKENS, MEDICAL_COLOR_PALETTE, type ColorToken } from '@/styles/unified-color-system';

// ===== COLOR CONTRAST VALIDATION =====

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 guidelines
 */
function getRelativeLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const sRGB = [r, g, b].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  isLargeText = false
): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
} {
  const ratio = getContrastRatio(foreground, background);
  const minRatioAA = isLargeText ? 3 : 4.5;
  const minRatioAAA = isLargeText ? 4.5 : 7;

  const passesAA = ratio >= minRatioAA;
  const passesAAA = ratio >= minRatioAAA;

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA,
    passesAAA,
    level: passesAAA ? 'AAA' : passesAA ? 'AA' : 'FAIL',
  };
}

// ===== COLOR SYSTEM VALIDATION =====

/**
 * Validate all color combinations in the system
 */
export function validateColorSystem(): {
  passed: number;
  failed: number;
  results: Array<{
    combination: string;
    foreground: string;
    background: string;
    result: ReturnType<typeof validateColorContrast>;
  }>;
} {
  const results: Array<{
    combination: string;
    foreground: string;
    background: string;
    result: ReturnType<typeof validateColorContrast>;
  }> = [];

  // Test critical color combinations
  const testCombinations = [
    { name: 'Primary text on white', fg: COLOR_TOKENS['text-primary'], bg: COLOR_TOKENS.background },
    { name: 'Secondary text on white', fg: COLOR_TOKENS['text-secondary'], bg: COLOR_TOKENS.background },
    { name: 'White text on primary', fg: COLOR_TOKENS['text-on-primary'], bg: COLOR_TOKENS.primary },
    { name: 'White text on secondary', fg: COLOR_TOKENS['text-on-secondary'], bg: COLOR_TOKENS.secondary },
    { name: 'Error text on error background', fg: COLOR_TOKENS.error, bg: COLOR_TOKENS['error-light'] },
    { name: 'Success text on success background', fg: COLOR_TOKENS.success, bg: COLOR_TOKENS['success-light'] },
    { name: 'Warning text on warning background', fg: COLOR_TOKENS.warning, bg: COLOR_TOKENS['warning-light'] },
    { name: 'Info text on info background', fg: COLOR_TOKENS.info, bg: COLOR_TOKENS['info-light'] },
    { name: 'Primary text on surface', fg: COLOR_TOKENS['text-primary'], bg: COLOR_TOKENS.surface },
    { name: 'Muted text on surface', fg: COLOR_TOKENS['text-muted'], bg: COLOR_TOKENS.surface },
  ];

  testCombinations.forEach(({ name, fg, bg }) => {
    const result = validateColorContrast(fg, bg);
    results.push({
      combination: name,
      foreground: fg,
      background: bg,
      result,
    });
  });

  const passed = results.filter((r) => r.result.passesAA).length;
  const failed = results.length - passed;

  return { passed, failed, results };
}

// ===== COLOR BLINDNESS SIMULATION =====

/**
 * Simulate color blindness for accessibility testing
 */
export function simulateColorBlindness(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  let newR, newG, newB;

  switch (type) {
    case 'protanopia': // Red-blind
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;
    case 'deuteranopia': // Green-blind
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;
    case 'tritanopia': // Blue-blind
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * g + 0.567 * b;
      newB = 0.475 * g + 0.525 * b;
      break;
    default:
      return hex;
  }

  // Convert back to hex
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

// ===== HARDCODED COLOR DETECTION =====

/**
 * Detect hardcoded colors in CSS/JS content
 */
export function detectHardcodedColors(content: string): Array<{
  color: string;
  line: number;
  context: string;
}> {
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  const rgbColorRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
  const rgbaColorRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;

  const lines = content.split('\n');
  const results: Array<{ color: string; line: number; context: string }> = [];

  lines.forEach((line, index) => {
    // Skip lines with CSS custom properties
    if (line.includes('--color-') || line.includes('var(--')) {
      return;
    }

    // Check for hex colors
    let match;
    while ((match = hexColorRegex.exec(line)) !== null) {
      results.push({
        color: match[0],
        line: index + 1,
        context: line.trim(),
      });
    }

    // Check for RGB colors
    while ((match = rgbColorRegex.exec(line)) !== null) {
      results.push({
        color: match[0],
        line: index + 1,
        context: line.trim(),
      });
    }

    // Check for RGBA colors
    while ((match = rgbaColorRegex.exec(line)) !== null) {
      results.push({
        color: match[0],
        line: index + 1,
        context: line.trim(),
      });
    }
  });

  return results;
}

// ===== COLOR SYSTEM HEALTH CHECK =====

/**
 * Comprehensive health check of the color system
 */
export function colorSystemHealthCheck(): {
  score: number;
  issues: string[];
  recommendations: string[];
  contrastResults: ReturnType<typeof validateColorSystem>;
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check contrast ratios
  const contrastResults = validateColorSystem();

  if (contrastResults.failed > 0) {
    issues.push(`${contrastResults.failed} color combinations fail WCAG AA standards`);
    recommendations.push('Review and adjust failing color combinations for better accessibility');
  }

  // Check for missing color tokens
  const requiredTokens: ColorToken[] = [
    'primary',
    'secondary',
    'background',
    'surface',
    'text-primary',
    'text-secondary',
    'border',
    'error',
    'success',
    'warning',
    'info',
  ];

  const missingTokens = requiredTokens.filter((token) => !COLOR_TOKENS[token]);
  if (missingTokens.length > 0) {
    issues.push(`Missing required color tokens: ${missingTokens.join(', ')}`);
    recommendations.push('Add missing color tokens to ensure complete coverage');
  }

  // Calculate health score
  const maxScore = 100;
  let score = maxScore;

  // Deduct points for contrast failures
  score -= contrastResults.failed * 10;

  // Deduct points for missing tokens
  score -= missingTokens.length * 5;

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  if (score === 100) {
    recommendations.push('Color system is healthy! Consider regular audits to maintain quality.');
  }

  return {
    score,
    issues,
    recommendations,
    contrastResults,
  };
}

// ===== TESTING UTILITIES =====

/**
 * Generate color palette preview for testing
 */
export function generateColorPreview(): Array<{
  category: string;
  colors: Array<{ name: string; value: string; usage: string }>;
}> {
  return [
    {
      category: 'Primary Colors',
      colors: [
        { name: 'Primary', value: COLOR_TOKENS.primary, usage: 'Main brand color, primary buttons' },
        { name: 'Primary Hover', value: COLOR_TOKENS['primary-hover'], usage: 'Hover states for primary elements' },
        { name: 'Primary Light', value: COLOR_TOKENS['primary-light'], usage: 'Light backgrounds, subtle highlights' },
      ],
    },
    {
      category: 'Text Colors',
      colors: [
        { name: 'Primary Text', value: COLOR_TOKENS['text-primary'], usage: 'Main content text' },
        { name: 'Secondary Text', value: COLOR_TOKENS['text-secondary'], usage: 'Supporting text, captions' },
        { name: 'Muted Text', value: COLOR_TOKENS['text-muted'], usage: 'Placeholder text, disabled states' },
      ],
    },
    {
      category: 'Semantic Colors',
      colors: [
        { name: 'Error', value: COLOR_TOKENS.error, usage: 'Error messages, destructive actions' },
        { name: 'Success', value: COLOR_TOKENS.success, usage: 'Success messages, confirmations' },
        { name: 'Warning', value: COLOR_TOKENS.warning, usage: 'Warning messages, cautions' },
        { name: 'Info', value: COLOR_TOKENS.info, usage: 'Information messages, tips' },
      ],
    },
  ];
}

// ===== AUTOMATED TESTING RUNNER =====

/**
 * Run all color system tests and generate report
 */
export function runColorSystemTests(): {
  timestamp: string;
  overallScore: number;
  healthCheck: ReturnType<typeof colorSystemHealthCheck>;
  colorBlindnessTest: {
    protanopia: Array<{ original: string; simulated: string; token: string }>;
    deuteranopia: Array<{ original: string; simulated: string; token: string }>;
    tritanopia: Array<{ original: string; simulated: string; token: string }>;
  };
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
} {
  const timestamp = new Date().toISOString();
  const healthCheck = colorSystemHealthCheck();

  // Test color blindness simulation for key colors
  const keyColors = ['primary', 'secondary', 'error', 'success', 'warning'] as const;
  const colorBlindnessTest = {
    protanopia: keyColors.map((token) => ({
      original: COLOR_TOKENS[token],
      simulated: simulateColorBlindness(COLOR_TOKENS[token], 'protanopia'),
      token,
    })),
    deuteranopia: keyColors.map((token) => ({
      original: COLOR_TOKENS[token],
      simulated: simulateColorBlindness(COLOR_TOKENS[token], 'deuteranopia'),
      token,
    })),
    tritanopia: keyColors.map((token) => ({
      original: COLOR_TOKENS[token],
      simulated: simulateColorBlindness(COLOR_TOKENS[token], 'tritanopia'),
      token,
    })),
  };

  const summary = {
    totalTests: healthCheck.contrastResults.results.length,
    passed: healthCheck.contrastResults.passed,
    failed: healthCheck.contrastResults.failed,
    warnings: healthCheck.issues.length,
  };

  return {
    timestamp,
    overallScore: healthCheck.score,
    healthCheck,
    colorBlindnessTest,
    summary,
  };
}

// ===== EXPORT TESTING FUNCTIONS =====

export const colorTesting = {
  validateColorContrast,
  validateColorSystem,
  simulateColorBlindness,
  detectHardcodedColors,
  colorSystemHealthCheck,
  generateColorPreview,
  getContrastRatio,
  runColorSystemTests,
};
