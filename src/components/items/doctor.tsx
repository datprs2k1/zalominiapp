import { HTMLProps, ReactNode, useState } from 'react';
import CheckIcon from '../icons/check';
import { Doctor } from '@/types';
import TransitionLink from '../transition-link';

interface DoctorWP {
  id: number;
  title?: { rendered?: string } | string;
  name?: string;
  languages?: string;
  specialties?: string;
  image?: string;
  _embedded?: { 'wp:featuredmedia'?: any[] };
  avatar?: string;
  bacsi_chucdanh?: string;
  bacsi_chuyenmon?: string;
  bacsi_donvi?: string;
  bacsi_kinhnghiem?: string;
  [key: string]: any;
}

interface DoctorItemProps extends HTMLProps<HTMLDivElement> {
  doctor: Doctor | DoctorWP;
  suffix?: ReactNode;
  withLanguages?: boolean;
  description?: ReactNode;
}

export default function DoctorItem({ doctor, suffix, withLanguages = true, description, ...props }: DoctorItemProps) {
  // Xử lý languages: string -> array
  const languages = (doctor.languages ? doctor.languages : typeof doctor.languages === 'string' ? doctor.languages : '')
    ? String(doctor.languages)
        .split(',')
        .map((l) => l.trim())
    : [];
  const [imgError, setImgError] = useState(false);

  // Lấy chuyên khoa nếu có
  const specialty = doctor.specialties || '';

  // Lấy ảnh đại diện nếu có, fallback nếu không
  let avatarUrl = '/avatar-doctor-fallback.png';
  if (!imgError) {
    const hasEmbedded = (d: any): d is { _embedded: { 'wp:featuredmedia': any[] } } =>
      d && typeof d === 'object' && '_embedded' in d && d._embedded && d._embedded['wp:featuredmedia'];
    if (hasEmbedded(doctor) && doctor._embedded['wp:featuredmedia'][0]?.source_url) {
      avatarUrl = doctor._embedded['wp:featuredmedia'][0].source_url;
    } else if (doctor.image) {
      avatarUrl = doctor.image;
    }
  }

  // Lấy tên bác sĩ
  let doctorName = '';
  if (typeof doctor.title === 'object' && doctor.title?.rendered) {
    doctorName = doctor.title.rendered;
  } else if (typeof doctor.title === 'string') {
    doctorName = doctor.title;
  } else if (doctor.name) {
    doctorName = doctor.name;
  }

  // Lấy thông tin chức danh và đơn vị
  const title = (doctor as DoctorWP).bacsi_chucdanh || '';
  const department = (doctor as DoctorWP).bacsi_donvi || '';
  const experience = (doctor as DoctorWP).bacsi_kinhnghiem || '';

  // Hiển thị tên đầy đủ với chức danh
  const fullName = title ? `${title} ${doctorName}` : doctorName;

  return (
    <TransitionLink
      to={`/doctor/${doctor.id}`}
      className="flex flex-col p-4 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 border-primary-500 bg-gray-50 shadow-sm">
            <img
              src={avatarUrl}
              alt={doctorName}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <div className="text-base font-semibold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
            {fullName}
          </div>

          {(specialty || department) && (
            <div className="text-sm text-gray-600 mt-1 leading-snug">{department || specialty}</div>
          )}

          {experience && <div className="text-sm text-gray-600 mt-1 line-clamp-2">{experience}</div>}
          {description && <div className="text-sm text-gray-700 mt-1 line-clamp-2">{description}</div>}

          {withLanguages && languages.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {languages.map((lang, idx) => (
                <span
                  key={lang + idx}
                  className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-100"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {suffix && <div className="flex justify-end mt-2">{suffix}</div>}
    </TransitionLink>
  );
}
