/**
 * Medical Doctors API
 * Handles fetching and caching of doctor profiles and medical staff information
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPDoctor } from './wp-types';
import { FetchOptions } from './cache';
import {
  fetchDoctors,
  fetchDoctor,
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
 * Interface for doctor query parameters
 */
export interface DoctorsQueryParams {
  readonly per_page?: number;
  readonly page?: number;
  readonly search?: string;
  readonly orderby?: 'date' | 'title' | 'modified';
  readonly order?: 'asc' | 'desc';
  readonly department?: string;
  readonly specialization?: string;
}

/**
 * Enhanced doctor data with medical-specific transformations
 */
export interface EnhancedDoctor extends WPDoctor {
  readonly featuredImageUrl: string | null;
  readonly plainTextContent: string;
  readonly truncatedBio: string;
  readonly formattedDate: string;
  readonly specializations: readonly string[];
  readonly qualifications: readonly string[];
  readonly experience: {
    readonly years?: number;
    readonly description?: string;
  };
  readonly contactInfo?: {
    readonly phone?: string;
    readonly email?: string;
    readonly office?: string;
    readonly schedule?: string;
  };
  readonly departmentInfo?: {
    readonly id?: number;
    readonly name?: string;
    readonly type?: string;
  };
  readonly languages: readonly string[];
  readonly consultationFee?: number;
  readonly rating?: {
    readonly average: number;
    readonly count: number;
  };
  readonly isAvailable: boolean;
  readonly priority: number; // For ordering doctors by seniority/importance
}

/**
 * Doctor statistics interface
 */
export interface DoctorStats {
  readonly totalDoctors: number;
  readonly availableDoctors: number;
  readonly averageExperience: number;
  readonly specializations: readonly string[];
  readonly departmentDistribution: Record<string, number>;
}

/**
 * Helper function to extract data from content with regex
 */
const extractFromContent = (content: string, regex: RegExp): string | undefined => {
  const match = content.match(regex);
  return match?.[1]?.trim();
};

/**
 * Transform raw WordPress doctor to enhanced doctor
 */
export const transformDoctor = (doctor: WPDoctor): EnhancedDoctor => {
  const plainTextContent = extractPlainText(doctor.content.rendered);
  const title = doctor.title.rendered;

  // Extract specializations from custom fields first, then fallback to content parsing
  const customSpecialization = doctor.bacsi_chuyenmon || doctor.specialization;
  let specializations: string[] = [];

  if (customSpecialization) {
    specializations = customSpecialization
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    // Fallback to content parsing
    const specializationMatches =
      plainTextContent.match(/(?:chuyên khoa|specialization|specialty)\s*:?\s*([^.]+)/gi) || [];
    specializations = specializationMatches.map((match) =>
      match.replace(/(?:chuyên khoa|specialization|specialty)\s*:?\s*/gi, '').trim()
    );
  }

  // Extract qualifications
  const qualificationMatches =
    plainTextContent.match(/(?:bằng cấp|qualification|degree|học vị)\s*:?\s*([^.]+)/gi) || [];
  const qualifications = qualificationMatches.map((match) =>
    match.replace(/(?:bằng cấp|qualification|degree|học vị)\s*:?\s*/gi, '').trim()
  );

  // Extract experience
  const experienceMatch = plainTextContent.match(/(\d+)\s*(?:năm|years?)\s*(?:kinh nghiệm|experience)/i);
  const experienceYears = experienceMatch ? parseInt(experienceMatch[1], 10) : undefined;
  const experienceDescMatch = plainTextContent.match(/(?:kinh nghiệm|experience)\s*:?\s*([^.]+)/i);

  // Extract contact information from custom fields first, then fallback to content parsing
  const contactInfo = {
    phone:
      doctor.bacsi_dienthoai ||
      doctor.phone ||
      extractFromContent(plainTextContent, /(?:điện thoại|phone|tel)\s*:?\s*([\d\s\-\+\(\)]+)/i),
    email:
      doctor.bacsi_email ||
      doctor.email ||
      extractFromContent(plainTextContent, /(?:email|e-mail)\s*:?\s*([\w\.-]+@[\w\.-]+\.\w+)/i),
    office:
      doctor.bacsi_phongkham || extractFromContent(plainTextContent, /(?:phòng khám|office|room)\s*:?\s*([^.]+)/i),
    schedule:
      doctor.bacsi_lichkham ||
      extractFromContent(plainTextContent, /(?:lịch khám|schedule|working hours)\s*:?\s*([^.]+)/i),
  };

  // Extract department information from custom fields first
  const departmentName =
    doctor.bacsi_donvi ||
    doctor.department ||
    extractFromContent(plainTextContent, /(?:khoa|department)\s*:?\s*([^.]+)/i);
  const departmentInfo = departmentName
    ? {
        name: departmentName,
        type: 'clinical' as const,
      }
    : undefined;

  // Extract languages from custom fields first
  const customLanguages = doctor.bacsi_ngonngu;
  let languages: string[] = [];

  if (customLanguages) {
    languages = customLanguages
      .split(/[,;]/)
      .map((lang) => lang.trim())
      .filter(Boolean);
  } else {
    // Fallback to content parsing
    const languageMatches = plainTextContent.match(/(?:ngôn ngữ|languages?)\s*:?\s*([^.]+)/i);
    languages = languageMatches ? languageMatches[1].split(/[,;]/).map((lang) => lang.trim()) : ['Tiếng Việt']; // Default to Vietnamese
  }

  // Extract consultation fee from custom fields first
  const customFee = doctor.bacsi_phikham;
  let consultationFee: number | undefined;

  if (customFee) {
    consultationFee = parseFloat(customFee.replace(/[.,]/g, ''));
  } else {
    // Fallback to content parsing
    const feeMatch = plainTextContent.match(/(?:phí khám|consultation fee|fee)\s*:?\s*(\d{1,3}(?:[.,]\d{3})*)/i);
    consultationFee = feeMatch ? parseFloat(feeMatch[1].replace(/[.,]/g, '')) : undefined;
  }

  // Determine availability from custom fields first
  const customStatus = doctor.bacsi_trangthai;
  const isAvailable = customStatus
    ? customStatus !== 'unavailable' && customStatus !== 'không có sẵn'
    : doctor.status === 'publish';

  // Calculate priority based on position and experience
  const position = doctor.bacsi_chucdanh || '';
  let priority = 5; // Default priority

  if (position.toLowerCase().includes('giáo sư') || title.toLowerCase().includes('professor')) {
    priority = 1;
  } else if (position.toLowerCase().includes('phó giáo sư') || title.toLowerCase().includes('associate professor')) {
    priority = 2;
  } else if (
    position.toLowerCase().includes('tiến sĩ') ||
    title.toLowerCase().includes('dr.') ||
    title.toLowerCase().includes('doctor')
  ) {
    priority = 3;
  } else if (position.toLowerCase().includes('thạc sĩ') || title.toLowerCase().includes('master')) {
    priority = 4;
  } else if (experienceYears && experienceYears >= 20) {
    priority = Math.min(priority, 1);
  } else if (experienceYears && experienceYears >= 15) {
    priority = Math.min(priority, 2);
  } else if (experienceYears && experienceYears >= 10) {
    priority = Math.min(priority, 3);
  } else if (experienceYears && experienceYears >= 5) {
    priority = Math.min(priority, 4);
  }
  if (
    title.toLowerCase().includes('tiến sĩ') ||
    title.toLowerCase().includes('doctor') ||
    title.toLowerCase().includes('phd')
  )
    priority = Math.min(priority, 3);

  return {
    ...doctor,
    featuredImageUrl: extractFeaturedImageUrl(doctor._embedded),
    plainTextContent,
    truncatedBio: truncateText(plainTextContent, 200),
    formattedDate: formatMedicalDate(doctor.date),
    specializations,
    qualifications,
    experience: {
      years: experienceYears,
      description: doctor.bacsi_kinhnghiem || experienceDescMatch?.[1]?.trim(),
    },
    contactInfo: Object.values(contactInfo).some((v) => v) ? contactInfo : undefined,
    departmentInfo,
    languages,
    consultationFee,
    isAvailable,
    priority,
  };
};

/**
 * Get doctors with enhanced data
 */
export const getDoctors = async (
  params: DoctorsQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedDoctor[]> => {
  const doctors = await fetchDoctors(params, options);
  const filteredDoctors = filterMedicalContent(doctors);
  const enhancedDoctors = filteredDoctors.map(transformDoctor);

  // Sort by priority (seniority) and then by name
  return enhancedDoctors.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.title.rendered.localeCompare(b.title.rendered, 'vi');
  });
};

/**
 * Get single doctor with enhanced data
 */
export const getDoctor = async (id: number, options?: FetchOptions): Promise<EnhancedDoctor> => {
  const doctor = await fetchDoctor(id, options);
  return transformDoctor(doctor);
};

/**
 * Get doctors by specialization
 */
export const getDoctorsBySpecialization = async (
  specialization: string,
  params: Omit<DoctorsQueryParams, 'specialization'> = {},
  options?: FetchOptions
): Promise<EnhancedDoctor[]> => {
  const allDoctors = await getDoctors(params, options);
  return allDoctors.filter((doctor) =>
    doctor.specializations.some((spec) => spec.toLowerCase().includes(specialization.toLowerCase()))
  );
};

/**
 * Get available doctors
 */
export const getAvailableDoctors = async (
  params: DoctorsQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedDoctor[]> => {
  const allDoctors = await getDoctors(params, options);
  return allDoctors.filter((doctor) => doctor.isAvailable);
};

/**
 * Search doctors
 */
export const searchDoctors = async (
  query: string,
  params: Omit<DoctorsQueryParams, 'search'> = {},
  options?: FetchOptions
): Promise<EnhancedDoctor[]> => {
  if (!query.trim()) {
    return [];
  }

  return getDoctors(
    {
      ...params,
      search: query.trim(),
      orderby: 'title',
    },
    options
  );
};

/**
 * Get senior doctors (high experience/qualifications)
 */
export const getSeniorDoctors = async (limit: number = 10, options?: FetchOptions): Promise<EnhancedDoctor[]> => {
  const doctors = await getDoctors({}, options);
  return doctors
    .filter((doctor) => doctor.priority <= 3) // Senior doctors only
    .slice(0, limit);
};

/**
 * Get doctor statistics
 */
export const getDoctorStats = async (options?: FetchOptions): Promise<DoctorStats> => {
  const doctors = await getDoctors({}, options);

  const availableCount = doctors.filter((d) => d.isAvailable).length;

  const experienceYears = doctors
    .map((d) => d.experience.years)
    .filter((years): years is number => years !== undefined);

  const averageExperience =
    experienceYears.length > 0 ? experienceYears.reduce((sum, years) => sum + years, 0) / experienceYears.length : 0;

  const allSpecializations = doctors
    .flatMap((d) => d.specializations)
    .filter((spec, index, arr) => arr.indexOf(spec) === index)
    .sort();

  const departmentDistribution: Record<string, number> = {};
  doctors.forEach((doctor) => {
    const deptName = doctor.departmentInfo?.name || 'Không xác định';
    departmentDistribution[deptName] = (departmentDistribution[deptName] || 0) + 1;
  });

  return {
    totalDoctors: doctors.length,
    availableDoctors: availableCount,
    averageExperience: Math.round(averageExperience * 10) / 10,
    specializations: allSpecializations,
    departmentDistribution,
  };
};

/**
 * Atom families for reactive state management
 */

// Doctors list atom family
export const doctorsAtomFamily = createListAtomFamily(getDoctors);

// Single doctor atom family
export const doctorAtomFamily = createItemAtomFamily(getDoctor);

// Doctors by specialization atom family
export const doctorsBySpecializationAtomFamily = atomFamily((specialization: string) =>
  atom(async () => await getDoctorsBySpecialization(specialization))
);

// Available doctors atom
export const availableDoctorsAtom = atom(async () => await getAvailableDoctors());

// Search doctors atom family
export const searchDoctorsAtomFamily = atomFamily((query: string) => atom(async () => await searchDoctors(query)));

// Senior doctors atom
export const seniorDoctorsAtom = atom(async () => await getSeniorDoctors());

// Doctor statistics atom
export const doctorStatsAtom = atom(async () => await getDoctorStats());

// Legacy exports for backward compatibility
export const doctorsAtom = atom(async () => await getDoctors());
