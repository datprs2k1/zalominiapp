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

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function DoctorItem({ doctor, suffix, withLanguages = true, description, ...props }: DoctorItemProps) {
  const [imgError, setImgError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Process languages: string -> array
  const languages = (doctor.languages ? doctor.languages : typeof doctor.languages === 'string' ? doctor.languages : '')
    ? String(doctor.languages)
        .split(',')
        .map((l) => l.trim())
    : [];

  // Get specialty
  const specialty = doctor.specialties || '';

  // Get avatar URL with fallback
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

  // Get doctor name
  let doctorName = '';
  if (typeof doctor.title === 'object' && doctor.title?.rendered) {
    doctorName = doctor.title.rendered;
  } else if (typeof doctor.title === 'string') {
    doctorName = doctor.title;
  } else if (doctor.name) {
    doctorName = doctor.name;
  }

  // Get title, department, and experience
  const title = (doctor as DoctorWP).bacsi_chucdanh || '';
  const department = (doctor as DoctorWP).bacsi_donvi || '';
  const experience = (doctor as DoctorWP).bacsi_kinhnghiem || '';

  // Display full name with title
  const fullName = title ? `${title} ${doctorName}` : doctorName;

  // Truncate experience text
  const truncatedExperience = truncateText(experience, 100);
  const shouldShowReadMore = experience && experience.length > 100;

  return (
    <div className="mobile-card-hospital group android-material-ripple mobile-gpu-accelerated">
      <TransitionLink to={`/doctor/${doctor.id}`} className="block p-3 sm:p-4 cursor-pointer comfortable-touch-target">
        {/* Vertical Layout - Avatar above info */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Avatar - Larger and centered above */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-medical overflow-hidden bg-gradient-to-br from-medical-50 to-medical-100 border-2 border-medical-200 shadow-subtle">
              <img
                src={avatarUrl}
                alt={doctorName}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            </div>
          </div>

          {/* Doctor Info - Centered below avatar */}
          <div className="w-full space-y-1.5 sm:space-y-2">
            {/* Name and Department */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-medical-800 leading-tight group-hover:text-medical-600 transition-colors duration-200 mb-0.5 sm:mb-1">
                {fullName}
              </h3>

              {(specialty || department) && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-medical-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-medium text-medical-600">{department || specialty}</span>
                </div>
              )}
            </div>

            {/* Experience Section - Centered layout */}
            {experience && (
              <div className="text-center">
                <p className="text-xs sm:text-sm text-medical-700 leading-relaxed">
                  {showFullDescription ? experience : truncatedExperience}
                </p>
                {shouldShowReadMore && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowFullDescription(!showFullDescription);
                    }}
                    className="text-xs text-medical-600 hover:text-medical-700 font-medium mt-1 transition-colors comfortable-touch-target inline-block"
                  >
                    {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </div>
            )}

            {/* Description */}
            {description && <div className="text-xs sm:text-sm text-medical-700 text-center">{description}</div>}

            {/* Languages Section - Centered layout */}
            {withLanguages && languages.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {languages.slice(0, 2).map((lang, idx) => (
                  <span
                    key={lang + idx}
                    className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-medical-50 text-medical-700 text-xs font-medium rounded-full border border-medical-200 shadow-subtle"
                  >
                    {lang}
                  </span>
                ))}
                {languages.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-neutral-50 text-neutral-600 text-xs font-medium rounded-full border border-neutral-200 shadow-subtle">
                    +{languages.length - 2} khác
                  </span>
                )}
              </div>
            )}

            {/* Suffix */}
            {suffix && <div className="flex justify-center pt-1.5 sm:pt-2 border-t border-medical-100">{suffix}</div>}
          </div>
        </div>
      </TransitionLink>
    </div>
  );
}
