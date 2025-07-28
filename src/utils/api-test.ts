/**
 * API Testing and Validation Utilities
 * Test the optimized doctor API to ensure all fields are properly fetched
 */

import { getDoctor, getDoctors } from '@/services/doctors';
import { fetchDoctor, DOCTOR_EMBED, DOCTOR_FIELDS, WP_ENDPOINTS } from '@/services/common';
import { fetchWPData } from '@/services/cache';

/**
 * Test direct API call without any processing
 */
export const testDirectDoctorAPI = async (doctorId: number) => {
  console.log(`🔍 Testing Direct Doctor API for ID: ${doctorId}`);

  try {
    // Test with different parameter combinations
    console.log('📡 Testing with _embed only...');
    const withEmbedOnly = await fetchWPData(`${WP_ENDPOINTS.DOCTORS}/${doctorId}`, {
      _embed: DOCTOR_EMBED,
    });
    console.log('With _embed only - has embedded:', !!withEmbedOnly._embedded);
    console.log('Featured media:', withEmbedOnly._embedded?.['wp:featuredmedia']?.[0]?.source_url);

    console.log('📡 Testing with _fields only...');
    const withFieldsOnly = await fetchWPData(`${WP_ENDPOINTS.DOCTORS}/${doctorId}`, {
      _fields: DOCTOR_FIELDS,
    });
    console.log('With _fields only - has embedded:', !!withFieldsOnly._embedded);
    console.log('Has custom fields:', !!withFieldsOnly.bacsi_chucdanh);

    console.log('📡 Testing with both _embed and _fields...');
    const withBoth = await fetchWPData(`${WP_ENDPOINTS.DOCTORS}/${doctorId}`, {
      _embed: DOCTOR_EMBED,
      _fields: DOCTOR_FIELDS,
    });
    console.log('With both - has embedded:', !!withBoth._embedded);
    console.log('With both - has custom fields:', !!withBoth.bacsi_chucdanh);
    console.log('Featured media:', withBoth._embedded?.['wp:featuredmedia']?.[0]?.source_url);

    return {
      withEmbedOnly,
      withFieldsOnly,
      withBoth,
    };
  } catch (error) {
    console.error('❌ Direct API Test failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Test single doctor API to check if all custom fields are fetched
 */
export const testDoctorAPI = async (doctorId: number) => {
  console.log(`🔍 Testing Doctor API for ID: ${doctorId}`);

  try {
    // Test raw fetch
    console.log('📡 Testing raw fetchDoctor...');
    const rawDoctor = await fetchDoctor(doctorId);

    // Debug the full response structure
    console.log('Full raw doctor response:', JSON.stringify(rawDoctor, null, 2));

    console.log('Raw doctor data:', {
      id: rawDoctor.id,
      title: rawDoctor.title.rendered,
      hasEmbedded: !!rawDoctor._embedded,
      embeddedKeys: rawDoctor._embedded ? Object.keys(rawDoctor._embedded) : [],
      featuredMediaArray: rawDoctor._embedded?.['wp:featuredmedia'],
      hasCustomFields: {
        bacsi_chucdanh: !!rawDoctor.bacsi_chucdanh,
        bacsi_chuyenmon: !!rawDoctor.bacsi_chuyenmon,
        bacsi_donvi: !!rawDoctor.bacsi_donvi,
        bacsi_kinhnghiem: !!rawDoctor.bacsi_kinhnghiem,
        bacsi_dienthoai: !!rawDoctor.bacsi_dienthoai,
        bacsi_email: !!rawDoctor.bacsi_email,
        bacsi_facebook: !!rawDoctor.bacsi_facebook,
        bacsi_zalo: !!rawDoctor.bacsi_zalo,
      },
      customFieldValues: {
        bacsi_chucdanh: rawDoctor.bacsi_chucdanh,
        bacsi_chuyenmon: rawDoctor.bacsi_chuyenmon,
        bacsi_donvi: rawDoctor.bacsi_donvi,
        bacsi_kinhnghiem: rawDoctor.bacsi_kinhnghiem,
        bacsi_dienthoai: rawDoctor.bacsi_dienthoai,
        bacsi_email: rawDoctor.bacsi_email,
        bacsi_facebook: rawDoctor.bacsi_facebook,
        bacsi_zalo: rawDoctor.bacsi_zalo,
      },
      featuredMedia: rawDoctor._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    });

    // Test enhanced doctor
    console.log('✨ Testing enhanced getDoctor...');
    const enhancedDoctor = await getDoctor(doctorId);
    console.log('Enhanced doctor data:', {
      id: enhancedDoctor.id,
      title: enhancedDoctor.title.rendered,
      featuredImageUrl: enhancedDoctor.featuredImageUrl,
      specializations: enhancedDoctor.specializations,
      qualifications: enhancedDoctor.qualifications,
      experience: enhancedDoctor.experience,
      contactInfo: enhancedDoctor.contactInfo,
      departmentInfo: enhancedDoctor.departmentInfo,
      languages: enhancedDoctor.languages,
      consultationFee: enhancedDoctor.consultationFee,
      isAvailable: enhancedDoctor.isAvailable,
      priority: enhancedDoctor.priority,
    });

    // Validation
    const missingFields = [];
    if (!rawDoctor.bacsi_chucdanh && !enhancedDoctor.experience?.description) {
      missingFields.push('Position/Experience');
    }
    if (!rawDoctor.bacsi_chuyenmon && enhancedDoctor.specializations.length === 0) {
      missingFields.push('Specializations');
    }
    if (!rawDoctor.bacsi_donvi && !enhancedDoctor.departmentInfo?.name) {
      missingFields.push('Department');
    }
    if (!rawDoctor._embedded?.['wp:featuredmedia']?.[0] && !enhancedDoctor.featuredImageUrl) {
      missingFields.push('Featured Image');
    }

    if (missingFields.length > 0) {
      console.warn('⚠️ Missing fields detected:', missingFields);
      return {
        success: false,
        missingFields,
        rawDoctor,
        enhancedDoctor,
      };
    }

    console.log('✅ All fields successfully fetched!');
    return {
      success: true,
      rawDoctor,
      enhancedDoctor,
    };
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Test multiple doctors API
 */
export const testDoctorsListAPI = async (limit: number = 5) => {
  console.log(`🔍 Testing Doctors List API (limit: ${limit})`);

  try {
    const doctors = await getDoctors({ per_page: limit });

    console.log(`📊 Fetched ${doctors.length} doctors`);

    const fieldStats = {
      withPosition: 0,
      withSpecializations: 0,
      withDepartment: 0,
      withContactInfo: 0,
      withFeaturedImage: 0,
      withExperience: 0,
    };

    doctors.forEach((doctor) => {
      if (doctor.bacsi_chucdanh || doctor.experience?.description) fieldStats.withPosition++;
      if (doctor.specializations.length > 0) fieldStats.withSpecializations++;
      if (doctor.departmentInfo?.name) fieldStats.withDepartment++;
      if (doctor.contactInfo) fieldStats.withContactInfo++;
      if (doctor.featuredImageUrl) fieldStats.withFeaturedImage++;
      if (doctor.experience?.years || doctor.experience?.description) fieldStats.withExperience++;
    });

    console.log('📈 Field Statistics:', {
      total: doctors.length,
      ...fieldStats,
      percentages: {
        withPosition: Math.round((fieldStats.withPosition / doctors.length) * 100),
        withSpecializations: Math.round((fieldStats.withSpecializations / doctors.length) * 100),
        withDepartment: Math.round((fieldStats.withDepartment / doctors.length) * 100),
        withContactInfo: Math.round((fieldStats.withContactInfo / doctors.length) * 100),
        withFeaturedImage: Math.round((fieldStats.withFeaturedImage / doctors.length) * 100),
        withExperience: Math.round((fieldStats.withExperience / doctors.length) * 100),
      },
    });

    return {
      success: true,
      doctors,
      fieldStats,
    };
  } catch (error) {
    console.error('❌ Doctors List API Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Run comprehensive API tests
 */
export const runAPITests = async () => {
  console.log('🚀 Starting comprehensive API tests...');

  // Test doctors list first to get some IDs
  const listResult = await testDoctorsListAPI(10);

  if (!listResult.success || !listResult.doctors) {
    console.error('❌ Cannot proceed with individual tests - list API failed');
    return { success: false };
  }

  // Test direct API calls first
  const directTests = [];
  for (let i = 0; i < Math.min(2, listResult.doctors.length); i++) {
    const doctor = listResult.doctors[i];
    const directResult = await testDirectDoctorAPI(doctor.id);
    directTests.push({
      doctorId: doctor.id,
      doctorName: doctor.title.rendered,
      ...directResult,
    });
  }

  // Test individual doctors
  const individualTests = [];
  for (let i = 0; i < Math.min(3, listResult.doctors.length); i++) {
    const doctor = listResult.doctors[i];
    const testResult = await testDoctorAPI(doctor.id);
    individualTests.push({
      doctorId: doctor.id,
      doctorName: doctor.title.rendered,
      ...testResult,
    });
  }

  console.log('🏁 API Tests completed!');
  return {
    success: true,
    listTest: listResult,
    directTests,
    individualTests,
  };
};

/**
 * Quick validation for production use
 */
export const validateDoctorData = (doctor: any) => {
  const issues = [];

  if (!doctor.title?.rendered) issues.push('Missing title');
  if (!doctor.content?.rendered) issues.push('Missing content');
  if (!doctor.featuredImageUrl && !doctor._embedded?.['wp:featuredmedia']?.[0]) {
    issues.push('Missing featured image');
  }

  // Check for essential custom fields
  if (!doctor.bacsi_chucdanh && !doctor.experience?.description) {
    issues.push('Missing position/experience information');
  }

  if (!doctor.bacsi_donvi && !doctor.departmentInfo?.name) {
    issues.push('Missing department information');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Quick test function for browser console
 * Usage: window.testDoctorAPI(123)
 */
export const quickTestDoctor = async (doctorId: number) => {
  try {
    const result = await testDirectDoctorAPI(doctorId);
    console.table({
      'Embed Only - Has Featured Image': !!result.withEmbedOnly?._embedded?.['wp:featuredmedia']?.[0],
      'Fields Only - Has Custom Fields': !!result.withFieldsOnly?.bacsi_chucdanh,
      'Both - Has Featured Image': !!result.withBoth?._embedded?.['wp:featuredmedia']?.[0],
      'Both - Has Custom Fields': !!result.withBoth?.bacsi_chucdanh,
    });
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    return { error };
  }
};

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testDoctorAPI = quickTestDoctor;
  (window as any).runAPITests = runAPITests;
}
