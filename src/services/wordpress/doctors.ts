/**
 * WordPress Doctors service module (custom post type)
 */

import { WordPressClient } from './client';
import { WPDoctor, WPQueryParams, WPRequestOptions, WPCollectionResponse } from './types';

export interface DoctorsQueryParams extends WPQueryParams {
  specialty?: string;
  department?: string;
  experience_years?: number;
  availability?: 'available' | 'busy' | 'unavailable';
}

export interface DoctorQueryOptions extends WPRequestOptions {
  normalize?: boolean;
}

/**
 * Doctors service class
 */
export class DoctorsService {
  constructor(private client: WordPressClient) {}

  /**
   * Get all doctors
   */
  async getDoctors(
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    const defaultParams: DoctorsQueryParams = {
      _embed: 'wp:featuredmedia',
      per_page: 100,
      status: 'publish',
      ...params,
    };

    return this.client.getCollection<WPDoctor>('doctors', defaultParams, options);
  }

  /**
   * Get single doctor by ID
   */
  async getDoctor(
    id: number,
    params: WPQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPDoctor> {
    const defaultParams: WPQueryParams = {
      _embed: 'wp:featuredmedia',
      ...params,
    };

    return this.client.getById<WPDoctor>('doctor', id, defaultParams, options);
  }

  /**
   * Search doctors by name or specialty
   */
  async searchDoctors(
    query: string,
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    return this.getDoctors({ ...params, search: query }, options);
  }

  /**
   * Get doctors by specialty
   */
  async getDoctorsBySpecialty(
    specialty: string,
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    return this.getDoctors({ ...params, specialty }, options);
  }

  /**
   * Get doctors by department
   */
  async getDoctorsByDepartment(
    department: string,
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    return this.getDoctors({ ...params, department }, options);
  }

  /**
   * Get available doctors
   */
  async getAvailableDoctors(
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    return this.getDoctors({ ...params, availability: 'available' }, options);
  }

  /**
   * Get featured doctors (by menu order or rating)
   */
  async getFeaturedDoctors(
    count: number = 5,
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    return this.getDoctors({
      ...params,
      per_page: count,
      orderby: 'menu_order',
      order: 'asc',
    }, options);
  }

  /**
   * Get doctors with most experience
   */
  async getExperiencedDoctors(
    minYears: number = 10,
    count: number = 10,
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<WPCollectionResponse<WPDoctor>> {
    const response = await this.getDoctors({
      ...params,
      per_page: 100, // Get more to filter
    }, options);

    // Filter by experience years (assuming it's stored in meta or content)
    const experiencedDoctors = response.items.filter(doctor => {
      const experienceYears = this.extractExperienceYears(doctor);
      return experienceYears >= minYears;
    });

    // Sort by experience and limit
    const sortedDoctors = experiencedDoctors
      .sort((a, b) => this.extractExperienceYears(b) - this.extractExperienceYears(a))
      .slice(0, count);

    return {
      ...response,
      items: sortedDoctors,
      total: sortedDoctors.length,
    };
  }

  /**
   * Get doctors grouped by specialty
   */
  async getDoctorsGroupedBySpecialty(
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<Record<string, WPDoctor[]>> {
    const response = await this.getDoctors(params, options);
    const grouped: Record<string, WPDoctor[]> = {};

    response.items.forEach(doctor => {
      const specialty = this.extractSpecialty(doctor) || 'General';
      if (!grouped[specialty]) {
        grouped[specialty] = [];
      }
      grouped[specialty].push(doctor);
    });

    return grouped;
  }

  /**
   * Get doctors grouped by department
   */
  async getDoctorsGroupedByDepartment(
    params: DoctorsQueryParams = {},
    options: DoctorQueryOptions = {}
  ): Promise<Record<string, WPDoctor[]>> {
    const response = await this.getDoctors(params, options);
    const grouped: Record<string, WPDoctor[]> = {};

    response.items.forEach(doctor => {
      const department = this.extractDepartment(doctor) || 'General';
      if (!grouped[department]) {
        grouped[department] = [];
      }
      grouped[department].push(doctor);
    });

    return grouped;
  }

  /**
   * Get doctor statistics
   */
  async getDoctorStats(): Promise<{
    total: number;
    available: number;
    specialties: Record<string, number>;
    departments: Record<string, number>;
    averageExperience: number;
  }> {
    const response = await this.getDoctors({ per_page: 100 });
    const doctors = response.items;

    const specialties: Record<string, number> = {};
    const departments: Record<string, number> = {};
    let totalExperience = 0;
    let availableCount = 0;

    doctors.forEach(doctor => {
      // Count specialties
      const specialty = this.extractSpecialty(doctor) || 'General';
      specialties[specialty] = (specialties[specialty] || 0) + 1;

      // Count departments
      const department = this.extractDepartment(doctor) || 'General';
      departments[department] = (departments[department] || 0) + 1;

      // Sum experience
      totalExperience += this.extractExperienceYears(doctor);

      // Count available doctors
      if (this.extractAvailability(doctor) === 'available') {
        availableCount++;
      }
    });

    return {
      total: doctors.length,
      available: availableCount,
      specialties,
      departments,
      averageExperience: doctors.length > 0 ? totalExperience / doctors.length : 0,
    };
  }

  /**
   * Invalidate doctors cache
   */
  invalidateCache(params: DoctorsQueryParams = {}): void {
    this.client.invalidateCache('doctors', params);
  }

  /**
   * Invalidate single doctor cache
   */
  invalidateDoctorCache(id: number, params: WPQueryParams = {}): void {
    this.client.invalidateCache('doctor', { ...params, id });
  }

  // Private helper methods for extracting doctor information
  private extractSpecialty(doctor: WPDoctor): string | null {
    // Try to extract specialty from meta, content, or title
    if (doctor.meta && doctor.meta.specialty) {
      return doctor.meta.specialty;
    }
    
    // Could also parse from content or title if needed
    return null;
  }

  private extractDepartment(doctor: WPDoctor): string | null {
    if (doctor.meta && doctor.meta.department) {
      return doctor.meta.department;
    }
    return null;
  }

  private extractExperienceYears(doctor: WPDoctor): number {
    if (doctor.meta && doctor.meta.experience_years) {
      return parseInt(doctor.meta.experience_years, 10) || 0;
    }
    return 0;
  }

  private extractAvailability(doctor: WPDoctor): string {
    if (doctor.meta && doctor.meta.availability) {
      return doctor.meta.availability;
    }
    return 'available'; // Default to available
  }
}

/**
 * Create doctors service instance
 */
export function createDoctorsService(client: WordPressClient): DoctorsService {
  return new DoctorsService(client);
}

/**
 * Utility functions for doctors
 */
export const DoctorsUtils = {
  /**
   * Get doctor's full name
   */
  getFullName: (doctor: WPDoctor): string => {
    return doctor.title.rendered;
  },

  /**
   * Get doctor's profile image URL
   */
  getProfileImageUrl: (doctor: WPDoctor, size: string = 'medium'): string | null => {
    const featuredMedia = doctor._embedded?.['wp:featuredmedia']?.[0];
    if (!featuredMedia) return null;

    if (featuredMedia.media_details?.sizes?.[size]) {
      return featuredMedia.media_details.sizes[size].source_url;
    }

    return featuredMedia.source_url || null;
  },

  /**
   * Get doctor's bio/description
   */
  getBio: (doctor: WPDoctor, maxLength?: number): string => {
    const content = doctor.content?.rendered?.replace(/<[^>]*>/g, '').trim() || '';
    return maxLength && content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  },

  /**
   * Get doctor's contact information
   */
  getContactInfo: (doctor: WPDoctor): {
    phone?: string;
    email?: string;
    office?: string;
  } => {
    return {
      phone: doctor.meta?.phone || undefined,
      email: doctor.meta?.email || undefined,
      office: doctor.meta?.office || undefined,
    };
  },

  /**
   * Get doctor's qualifications
   */
  getQualifications: (doctor: WPDoctor): string[] => {
    if (doctor.meta?.qualifications) {
      return Array.isArray(doctor.meta.qualifications) 
        ? doctor.meta.qualifications 
        : [doctor.meta.qualifications];
    }
    return [];
  },

  /**
   * Get doctor's working hours
   */
  getWorkingHours: (doctor: WPDoctor): Record<string, string> => {
    return doctor.meta?.working_hours || {};
  },

  /**
   * Check if doctor is available
   */
  isAvailable: (doctor: WPDoctor): boolean => {
    const availability = doctor.meta?.availability || 'available';
    return availability === 'available';
  },

  /**
   * Format doctor's experience
   */
  formatExperience: (doctor: WPDoctor): string => {
    const years = doctor.meta?.experience_years;
    if (!years) return 'Experience not specified';
    
    const yearsNum = parseInt(years, 10);
    return yearsNum === 1 ? '1 year of experience' : `${yearsNum} years of experience`;
  },
};
