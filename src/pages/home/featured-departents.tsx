import Section from '@/components/section';
import { useState } from 'react';
import TransitionLink from '@/components/transition-link';
import { departmentsAtom } from '@/services/departments';
import { useAtomValue } from 'jotai';
import { WPPage } from '@/services/wp-types';
import { decodeHTML } from '@/utils/decodeHTML';
import { CARD_DIMENSIONS, SPACING, BORDER_RADIUS, TYPOGRAPHY, combineClasses } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

const POST_ATOM_PARAMS = { per_page: 8 };

type DepartmentWithMeta = WPPage & {
  featuredImage?: string | null;
  color?: string;
  acf?: {
    doctor_count?: number;
    [key: string]: any;
  };
};

const DepartmentCard = ({ department }: { department: DepartmentWithMeta }) => {
  // Modern medical color palette
  const getMedicalColors = (color?: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        gradient: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-200',
        icon: 'text-blue-500',
      },
      green: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        gradient: 'from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-200',
        icon: 'text-emerald-500',
      },
      teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        gradient: 'from-teal-500/10 to-teal-600/5',
        border: 'border-teal-200',
        icon: 'text-teal-500',
      },
      purple: {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        gradient: 'from-violet-500/10 to-violet-600/5',
        border: 'border-violet-200',
        icon: 'text-violet-500',
      },
      rose: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        gradient: 'from-rose-500/10 to-rose-600/5',
        border: 'border-rose-200',
        icon: 'text-rose-500',
      },
      amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        gradient: 'from-amber-500/10 to-amber-600/5',
        border: 'border-amber-200',
        icon: 'text-amber-500',
      },
    };
    return colorMap[color || 'blue'] || colorMap.blue;
  };

  const colors = getMedicalColors(department.color);

  // Department specialty icons
  const getSpecialtyIcon = (name: string) => {
    const titleLower = name.toLowerCase();

    if (titleLower.includes('tim') || titleLower.includes('cardi')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    } else if (titleLower.includes('não') || titleLower.includes('thần kinh') || titleLower.includes('neuro')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" x2="2" y1="8" y2="22" />
          <line x1="17.5" x2="9" y1="15" y2="15" />
        </svg>
      );
    } else if (titleLower.includes('nhi') || titleLower.includes('trẻ em') || titleLower.includes('pediatr')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    } else if (titleLower.includes('mắt') || titleLower.includes('nhãn') || titleLower.includes('ophthal')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    } else {
      // Default medical cross icon
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
        >
          <path d="M8 19h8a2 2 0 0 0 2-2v-1a3 3 0 0 0-3-3h-1a3 3 0 0 1-3-3v-1a2 2 0 0 1 2-2h6" />
          <path d="M8 5h8" />
          <path d="M8 9h6" />
        </svg>
      );
    }
  };

  // Get department title
  const departmentTitle = decodeHTML(department.title.rendered);

  return (
    <TransitionLink to={`/department/${department.id}`} className="block w-full h-full focus:outline-none">
      <div
        className={combineClasses(
          'group',
          'relative flex flex-row rounded-2xl overflow-hidden',
          'min-h-[120px] md:min-h-[140px]',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200 ease-out',
          'border',
          department.featuredImage ? 'border-gray-100' : `${colors.border}`,
          'hover:-translate-y-0.5 hover:border-opacity-80',
          department.featuredImage ? 'bg-cover bg-center' : `${colors.bg}`,
          'medical-department-card'
        )}
        style={
          department.featuredImage
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%), url(${department.featuredImage})`,
              }
            : undefined
        }
      >
        {/* Gradient background when no image */}
        {!department.featuredImage && <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}></div>}

        {/* Content overlay */}
        <div className={combineClasses('relative w-full h-full', 'p-4 md:p-5', 'flex flex-col justify-between z-10')}>
          {/* Department name with enhanced typography */}
          <div>
            <h3
              className={combineClasses(
                TYPOGRAPHY.cardTitle,
                'leading-tight font-bold text-lg md:text-xl',
                department.featuredImage ? 'text-white drop-shadow-md' : colors.text
              )}
            >
              {departmentTitle}
            </h3>

            {/* Light description for departments - optional small text */}
            {department.excerpt?.rendered && (
              <p
                className={combineClasses(
                  'mt-1 text-xs line-clamp-2',
                  department.featuredImage ? 'text-white/80' : 'text-gray-600'
                )}
              >
                {decodeHTML(department.excerpt.rendered.replace(/<[^>]*>?/gm, '')).substring(0, 60)}...
              </p>
            )}
          </div>

          {/* Doctor count or CTA */}
          <div className="flex items-start mt-2">
            {department.acf?.doctor_count ? (
              <div
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
                  ${
                    department.featuredImage
                      ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                      : `bg-white/70 ${colors.text} border ${colors.border}`
                  }
                  group-hover:scale-105 transition-all duration-200
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="medical-doctor-icon"
                  aria-label="Số lượng bác sĩ"
                  role="img"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{(department as any).acf?.doctor_count || 'Nhiều'} bác sĩ</span>
              </div>
            ) : (
              <div
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  ${
                    department.featuredImage
                      ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                      : `bg-white/70 ${colors.text} border ${colors.border}`
                  }
                  group-hover:scale-105 transition-all duration-200
                `}
              >
                <span>Xem chi tiết</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};

const FeaturedDepartents = () => {
  const [viewAll, setViewAll] = useState(false);
  const departmentsData = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const departments = departmentsData || [];

  // Process departments to extract featured image and assign medical colors
  const processedDepartments = departments.map((department, index) => {
    // Get featured image from embedded media if available
    const featuredImage = department._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

    // Assign modern medical-themed colors based on index for visual variety
    const medicalColors = ['blue', 'green', 'teal', 'purple', 'rose', 'amber'];
    const color = medicalColors[index % medicalColors.length];

    return {
      ...department,
      featuredImage,
      color,
    };
  });

  const displayedDepartments = viewAll ? processedDepartments : processedDepartments.slice(0, 4);
  const hasMoreDepartments = processedDepartments.length > 6;

  return (
    <div className="relative z-10">
      <Section
        className="mt-6 mb-2"
        title="Các chuyên khoa"
        viewMore="/departments"
        accentColor="blue"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="medical-section-icon"
            aria-label="Các chuyên khoa y tế"
            role="img"
          >
            <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
            <path d="M3.69 8.56A9 9 0 0 0 3 12" />
            <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
            <path d="M8.56 20.31A9 9 0 0 0 12 21" />
            <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
            <path d="M20.31 15.44A9 9 0 0 0 21 12" />
            <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
            <path d="M15.44 3.69A9 9 0 0 0 12 3" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        }
      >
        {/* Modern 3 column grid for larger screens, 2 columns for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 medical-departments-grid">
          {displayedDepartments.map((department, index) => (
            <div key={department.id} className="medical-department-item" style={{ animationDelay: `${index * 80}ms` }}>
              <DepartmentCard department={department} />
            </div>
          ))}
        </div>

        {/* View more button with modern design */}
        {!viewAll && hasMoreDepartments && (
          <button
            onClick={() => setViewAll(true)}
            className={combineClasses(
              'mt-5 w-full min-h-[48px] py-3',
              'rounded-xl',
              'bg-gradient-to-r from-blue-50 to-cyan-50',
              'border border-blue-200/70',
              'text-blue-700 hover:text-blue-900',
              'font-medium text-sm',
              'hover:shadow-md hover:shadow-blue-500/5',
              'active:scale-[0.99]',
              'transition-all duration-200 ease-out',
              'flex items-center justify-center gap-2',
              'medical-view-more-btn'
            )}
            aria-label="Xem thêm các chuyên khoa"
          >
            <span>Xem thêm chuyên khoa</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-blue-50/50 z-0"></div>
        <div className="absolute -bottom-8 -right-4 w-16 h-16 rounded-full bg-teal-50/40 z-0"></div>
      </Section>

      {/* Enhanced Medical Department Styling */}
      <style>{`
        /* Medical department grid animation */
        .medical-departments-grid {
          opacity: 0;
          animation: medicalGridFadeIn 0.6s ease-out 0.2s forwards;
        }

        @keyframes medicalGridFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Medical department item staggered animation */
        .medical-department-item {
          opacity: 0;
          transform: translateY(10px);
          animation: medicalDepartmentSlideIn 0.4s ease-out forwards;
        }

        @keyframes medicalDepartmentSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Medical department card hover effects */
        .medical-department-card {
          overflow: hidden;
          will-change: transform;
        }
        
        .medical-department-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease-out;
          z-index: 1;
          pointer-events: none;
        }

        .medical-department-card:hover::before {
          left: 100%;
        }

        /* Medical specialty icon animation */
        .medical-specialty-icon {
          animation: specialtyIconFloat 3s ease-in-out infinite;
        }

        @keyframes specialtyIconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* Medical doctor icon animation */
        .medical-doctor-icon {
          animation: medicalDoctorIconBounce 1.5s ease-in-out infinite;
        }

        @keyframes medicalDoctorIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }

        /* Medical section icon animation */
        .medical-section-icon {
          animation: sectionIconPulse 2s ease-in-out infinite;
        }

        @keyframes sectionIconPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
          .medical-departments-grid,
          .medical-department-item,
          .medical-specialty-icon,
          .medical-doctor-icon,
          .medical-section-icon {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }

        /* Focus states for accessibility */
        .medical-department-card:focus-visible {
          outline: 2px solid ${getColorToken('primary')};
          outline-offset: 2px;
        }
        
        /* Add responsiveness for zalo mini app */
        @media screen and (max-width: 480px) {
          .medical-department-card {
            min-height: 110px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedDepartents;
