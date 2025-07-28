/**
 * Medical Departments API
 * Handles fetching and caching of hospital departments and specialties
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPage } from './wp-types';
import { FetchOptions } from './cache';
import { DEPARTMENT_ID } from '@/config';
import {
  fetchPages,
  fetchPage,
  createListAtomFamily,
  createItemAtomFamily,
  filterMedicalContent,
  sortByMedicalPriority,
  extractFeaturedImageUrl,
  extractPlainText,
  truncateText,
  formatMedicalDate,
} from './common';

/**
 * Interface for department query parameters
 */
export interface DepartmentsQueryParams {
  readonly per_page?: number;
  readonly page?: number;
  readonly search?: string;
  readonly orderby?: 'date' | 'title' | 'menu_order' | 'modified';
  readonly order?: 'asc' | 'desc';
}

/**
 * Enhanced department data with medical-specific transformations
 */
export interface EnhancedDepartment extends WPPage {
  readonly featuredImageUrl: string | null;
  readonly plainTextContent: string;
  readonly truncatedDescription: string;
  readonly formattedDate: string;
  readonly departmentType: 'clinical' | 'diagnostic' | 'support' | 'administrative';
  readonly specialties: readonly string[];
  readonly contactInfo?: {
    readonly phone?: string;
    readonly email?: string;
    readonly location?: string;
    readonly hours?: string;
  };
  readonly staffCount?: number;
  readonly isEmergency: boolean;
  readonly priority: number; // For ordering departments by importance
}

/**
 * Department statistics interface
 */
export interface DepartmentStats {
  readonly totalDepartments: number;
  readonly clinicalDepartments: number;
  readonly diagnosticDepartments: number;
  readonly emergencyDepartments: number;
  readonly averageStaffCount: number;
}

/**
 * Transform raw WordPress page to enhanced department
 */
export const transformDepartment = (department: WPPage): EnhancedDepartment => {
  const plainTextContent = extractPlainText(department.content.rendered);
  const title = department.title.rendered.toLowerCase();

  // Determine department type based on title and content
  let departmentType: EnhancedDepartment['departmentType'] = 'clinical';
  if (
    title.includes('xét nghiệm') ||
    title.includes('chẩn đoán') ||
    title.includes('x-quang') ||
    title.includes('siêu âm')
  ) {
    departmentType = 'diagnostic';
  } else if (title.includes('hành chính') || title.includes('quản lý') || title.includes('tài chính')) {
    departmentType = 'administrative';
  } else if (title.includes('hỗ trợ') || title.includes('dược') || title.includes('dinh dưỡng')) {
    departmentType = 'support';
  }

  // Check if emergency department
  const isEmergency = title.includes('cấp cứu') || title.includes('응급') || title.includes('emergency');

  // Extract specialties from content
  const specialtyMatches = plainTextContent.match(/chuyên khoa\s*:?\s*([^.]+)/gi) || [];
  const specialties = specialtyMatches.map((match) => match.replace(/chuyên khoa\s*:?\s*/gi, '').trim());

  // Extract contact information
  const phoneMatch = plainTextContent.match(/(?:điện thoại|phone|tel)\s*:?\s*([\d\s\-\+\(\)]+)/i);
  const emailMatch = plainTextContent.match(/(?:email|e-mail)\s*:?\s*([\w\.-]+@[\w\.-]+\.\w+)/i);
  const locationMatch = plainTextContent.match(/(?:địa chỉ|location|vị trí)\s*:?\s*([^.]+)/i);
  const hoursMatch = plainTextContent.match(/(?:giờ làm việc|working hours|thời gian)\s*:?\s*([^.]+)/i);

  const contactInfo = {
    phone: phoneMatch?.[1]?.trim(),
    email: emailMatch?.[1]?.trim(),
    location: locationMatch?.[1]?.trim(),
    hours: hoursMatch?.[1]?.trim(),
  };

  // Extract staff count if mentioned
  const staffMatch = plainTextContent.match(/(\d+)\s*(?:bác sĩ|nhân viên|staff|doctors)/i);
  const staffCount = staffMatch ? parseInt(staffMatch[1], 10) : undefined;

  // Determine priority (emergency departments get highest priority)
  let priority = 5; // Default priority
  if (isEmergency) priority = 1;
  else if (departmentType === 'clinical') priority = 2;
  else if (departmentType === 'diagnostic') priority = 3;
  else if (departmentType === 'support') priority = 4;

  return {
    ...department,
    featuredImageUrl: extractFeaturedImageUrl(department._embedded),
    plainTextContent,
    truncatedDescription: truncateText(plainTextContent, 200),
    formattedDate: formatMedicalDate(department.date),
    departmentType,
    specialties,
    contactInfo: Object.values(contactInfo).some((v) => v) ? contactInfo : undefined,
    staffCount,
    isEmergency,
    priority,
  };
};

/**
 * Get medical departments with enhanced data
 */
export const getDepartments = async (
  params: DepartmentsQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedDepartment[]> => {
  const departments = await fetchPages(
    {
      parent: DEPARTMENT_ID,
      orderby: 'menu_order',
      order: 'asc',
      ...params,
    },
    options
  );

  const filteredDepartments = filterMedicalContent(departments);
  const enhancedDepartments = filteredDepartments.map(transformDepartment);

  // Sort by priority and then by menu order
  return enhancedDepartments.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.menu_order - b.menu_order;
  });
};

/**
 * Get single department with enhanced data
 */
export const getDepartment = async (id: number, options?: FetchOptions): Promise<EnhancedDepartment> => {
  const department = await fetchPage(id, options);
  return transformDepartment(department);
};

/**
 * Get departments by type
 */
export const getDepartmentsByType = async (
  type: EnhancedDepartment['departmentType'],
  params: Omit<DepartmentsQueryParams, 'search'> = {},
  options?: FetchOptions
): Promise<EnhancedDepartment[]> => {
  const allDepartments = await getDepartments(params, options);
  return allDepartments.filter((dept) => dept.departmentType === type);
};

/**
 * Get emergency departments
 */
export const getEmergencyDepartments = async (options?: FetchOptions): Promise<EnhancedDepartment[]> => {
  const allDepartments = await getDepartments({}, options);
  return allDepartments.filter((dept) => dept.isEmergency);
};

/**
 * Search departments
 */
export const searchDepartments = async (
  query: string,
  params: Omit<DepartmentsQueryParams, 'search'> = {},
  options?: FetchOptions
): Promise<EnhancedDepartment[]> => {
  if (!query.trim()) {
    return [];
  }

  return getDepartments(
    {
      ...params,
      search: query.trim(),
      orderby: 'title',
    },
    options
  );
};

/**
 * Get department statistics
 */
export const getDepartmentStats = async (options?: FetchOptions): Promise<DepartmentStats> => {
  const departments = await getDepartments({}, options);

  const clinicalCount = departments.filter((d) => d.departmentType === 'clinical').length;
  const diagnosticCount = departments.filter((d) => d.departmentType === 'diagnostic').length;
  const emergencyCount = departments.filter((d) => d.isEmergency).length;

  const staffCounts = departments.map((d) => d.staffCount).filter((count): count is number => count !== undefined);

  const averageStaffCount =
    staffCounts.length > 0 ? staffCounts.reduce((sum, count) => sum + count, 0) / staffCounts.length : 0;

  return {
    totalDepartments: departments.length,
    clinicalDepartments: clinicalCount,
    diagnosticDepartments: diagnosticCount,
    emergencyDepartments: emergencyCount,
    averageStaffCount: Math.round(averageStaffCount),
  };
};

/**
 * Atom families for reactive state management
 */

// Departments list atom family
export const departmentsAtomFamily = createListAtomFamily(getDepartments);

// Single department atom family
export const departmentAtomFamily = createItemAtomFamily(getDepartment);

// Departments by type atom family
export const departmentsByTypeAtomFamily = atomFamily((type: EnhancedDepartment['departmentType']) =>
  atom(async () => await getDepartmentsByType(type))
);

// Emergency departments atom
export const emergencyDepartmentsAtom = atom(async () => await getEmergencyDepartments());

// Search departments atom family
export const searchDepartmentsAtomFamily = atomFamily((query: string) =>
  atom(async () => await searchDepartments(query))
);

// Department statistics atom
export const departmentStatsAtom = atom(async () => await getDepartmentStats());

// Legacy exports for backward compatibility
export const departmentsAtom = departmentsAtomFamily;
export const departmentAtom = departmentAtomFamily;
