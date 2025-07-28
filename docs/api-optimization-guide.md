# API Optimization Guide - Doctor Detail Page

## 📋 Tổng quan

Hướng dẫn này mô tả các tối ưu hóa API được thực hiện cho trang doctor detail để đảm bảo lấy đầy đủ thông tin từ WordPress API.

## 🔧 Các tối ưu hóa đã thực hiện

### 1. Cập nhật WPDoctor Interface

**File:** `src/services/wp-types.ts`

Đã thêm đầy đủ các custom fields của WordPress:

```typescript
export interface WPDoctor {
  // ... existing fields

  // Medical-specific custom fields (bacsi_* fields)
  readonly bacsi_chucdanh?: string; // Position/Title
  readonly bacsi_chuyenmon?: string; // Specialization
  readonly bacsi_donvi?: string; // Department/Unit
  readonly bacsi_kinhnghiem?: string; // Experience
  readonly bacsi_ngonngu?: string; // Languages
  readonly bacsi_trangthai?: string; // Status
  readonly bacsi_hocvan?: string; // Education
  readonly bacsi_bangcap?: string; // Qualifications
  readonly bacsi_phongkham?: string; // Clinic/Office
  readonly bacsi_lichkham?: string; // Schedule
  readonly bacsi_phikham?: string; // Consultation fee
  readonly bacsi_dienthoai?: string; // Phone
  readonly bacsi_email?: string; // Email
  readonly bacsi_facebook?: string; // Facebook
  readonly bacsi_zalo?: string; // Zalo
  // ... more fields
}
```

### 2. Tối ưu API Parameters

**File:** `src/services/common.ts`

#### Enhanced DOCTOR_EMBED

```typescript
export const DOCTOR_EMBED = 'wp:featuredmedia,wp:term';
```

#### Comprehensive DOCTOR_FIELDS

```typescript
export const DOCTOR_FIELDS = [
  'id',
  'title',
  'content',
  'date',
  'modified',
  'slug',
  'status',
  'link',
  'featured_media',
  'meta',
  '_embedded',
  '_links',
  // Custom doctor fields
  'bacsi_chucdanh',
  'bacsi_chuyenmon',
  'bacsi_donvi',
  'bacsi_kinhnghiem',
  'bacsi_ngonngu',
  'bacsi_trangthai',
  'bacsi_hocvan',
  'bacsi_bangcap',
  'bacsi_phongkham',
  'bacsi_lichkham',
  'bacsi_phikham',
  'bacsi_dienthoai',
  'bacsi_email',
  'bacsi_facebook',
  'bacsi_zalo',
  'bacsi_website',
  'bacsi_diachi',
  'bacsi_mota',
  'bacsi_thutu',
  // Legacy contact fields
  'phone',
  'email',
  'facebook',
  'zalo',
  'website',
  'department',
].join(',');
```

#### Updated buildDoctorsParams

```typescript
export const buildDoctorsParams = (params = {}) => ({
  _embed: DOCTOR_EMBED,
  _fields: params.include_all_fields !== false ? DOCTOR_FIELDS : undefined,
  per_page: params.per_page || 100,
  ...params,
});
```

### 3. Enhanced Data Transformation

**File:** `src/services/doctors.ts`

#### Improved transformDoctor Function

- **Custom Fields Priority**: Ưu tiên sử dụng custom fields trước, sau đó mới fallback về content parsing
- **Better Contact Info**: Lấy thông tin liên hệ từ custom fields
- **Enhanced Experience**: Xử lý kinh nghiệm từ `bacsi_kinhnghiem`
- **Improved Availability**: Kiểm tra trạng thái từ `bacsi_trangthai`

```typescript
// Extract contact information from custom fields first
const contactInfo = {
  phone: doctor.bacsi_dienthoai || doctor.phone || extractFromContent(...),
  email: doctor.bacsi_email || doctor.email || extractFromContent(...),
  office: doctor.bacsi_phongkham || extractFromContent(...),
  schedule: doctor.bacsi_lichkham || extractFromContent(...),
};
```

### 4. UI Enhancements

**File:** `src/pages/detail/doctor.tsx`

#### Enhanced Doctor Information Display

- Hiển thị chuyên khoa (specializations)
- Hiển thị bằng cấp (qualifications)
- Hiển thị ngôn ngữ (languages)
- Hiển thị phí khám (consultation fee)

#### Mobile-First Design

- Hero section tối ưu cho mobile
- Floating contact buttons
- Responsive layout với animations
- Touch-optimized interactions

### 5. Debug Tools

#### API Debug Component

**File:** `src/components/debug/api-debug.tsx`

- Hiển thị thông tin debug trong development mode
- Validation data quality
- Missing fields detection
- Real-time API monitoring

#### API Testing Utilities

**File:** `src/utils/api-test.ts`

- `testDoctorAPI()` - Test single doctor API
- `testDoctorsListAPI()` - Test doctors list API
- `runAPITests()` - Comprehensive testing
- `validateDoctorData()` - Data validation

## 🚀 Cách sử dụng

### 1. Fetch Single Doctor

```typescript
import { getDoctor } from '@/services/doctors';

const doctor = await getDoctor(123);
console.log(doctor.specializations); // Array of specializations
console.log(doctor.contactInfo); // Contact information
console.log(doctor.experience); // Experience data
```

### 2. Fetch Doctors List

```typescript
import { getDoctors } from '@/services/doctors';

const doctors = await getDoctors({ per_page: 20 });
doctors.forEach((doctor) => {
  console.log(doctor.featuredImageUrl); // Direct image URL
  console.log(doctor.departmentInfo); // Department info
});
```

### 3. Using in Components

```typescript
import { useAtomValue } from 'jotai';
import { doctorAtomFamily } from '@/services/doctors';

function DoctorComponent({ doctorId }) {
  const doctor = useAtomValue(doctorAtomFamily(doctorId));

  return (
    <div>
      <h1>{doctor.title.rendered}</h1>
      <p>Chuyên khoa: {doctor.specializations.join(', ')}</p>
      <p>Phí khám: {doctor.consultationFee?.toLocaleString('vi-VN')} VNĐ</p>
      {doctor.contactInfo?.phone && (
        <a href={`tel:${doctor.contactInfo.phone}`}>
          {doctor.contactInfo.phone}
        </a>
      )}
    </div>
  );
}
```

## 🔍 Testing & Debugging

### Development Mode Debug

Trong development mode, trang doctor detail sẽ hiển thị API Debug component ở góc dưới bên phải để:

- Kiểm tra data quality
- Hiển thị missing fields
- Validate API response
- Monitor performance

### Manual Testing

```typescript
import { runAPITests } from '@/utils/api-test';

// Run comprehensive tests
const results = await runAPITests();
console.log(results);
```

## 📊 Performance Improvements

### Before Optimization

- ❌ Thiếu nhiều custom fields
- ❌ Không có featured image URL
- ❌ Contact info không đầy đủ
- ❌ Experience data bị thiếu

### After Optimization

- ✅ Đầy đủ custom fields từ WordPress
- ✅ Enhanced data transformation
- ✅ Comprehensive contact information
- ✅ Rich experience and qualification data
- ✅ Mobile-optimized UI
- ✅ Debug tools for monitoring

## 🛠️ Troubleshooting

### Common Issues

1. **Missing Custom Fields**

   - Kiểm tra WordPress có đúng custom fields không
   - Verify `DOCTOR_FIELDS` includes all required fields
   - Check API response in debug component

2. **Featured Image Not Loading**

   - Ensure `_embed=wp:featuredmedia` is included
   - Check WordPress media permissions
   - Verify image URLs in API response

3. **Contact Info Missing**
   - Check custom fields: `bacsi_dienthoai`, `bacsi_email`, etc.
   - Verify fallback content parsing
   - Use debug component to inspect data

### Debug Commands

```typescript
// Test specific doctor
await testDoctorAPI(123);

// Validate data
const validation = validateDoctorData(doctor);
console.log(validation);

// Check field statistics
await testDoctorsListAPI(10);
```

## 📝 Next Steps

1. **Monitor API Performance**: Sử dụng debug tools để theo dõi data quality
2. **Add More Fields**: Thêm custom fields mới khi cần thiết
3. **Optimize Caching**: Cải thiện cache strategy cho better performance
4. **Error Handling**: Enhance error handling cho edge cases
5. **Testing**: Thêm automated tests cho API functions
