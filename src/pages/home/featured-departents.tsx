import Section from '@/components/section';
import { useState, useEffect, useRef } from 'react';
import TransitionLink from '@/components/transition-link';
import { departmentsAtom } from '@/services/departments';
import { useAtomValue } from 'jotai';
import { WPPage } from '@/services/wp-types';
import { decodeHTML } from '@/utils/decodeHTML';
import {
  CARD_DIMENSIONS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  MEDICAL_WIDTHS,
  combineClasses,
} from '@/styles/medical-design-system';
import { getColorToken, getMedicalColor, MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

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
  // Premium healthcare color palette using unified color system
  const getMedicalColors = (color?: string) => {
    const colorMap = {
      // Medical Blue - Primary trust color (#2563EB/#1E40AF)
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        gradient: 'from-blue-500/12 to-blue-600/8',
        border: 'border-blue-200/80',
        icon: 'text-blue-600',
        accent: '#2563EB',
        surface: 'bg-blue-50/70',
      },
      // Healing Green - Recovery and growth (#10B981/#059669)
      green: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        gradient: 'from-emerald-500/12 to-emerald-600/8',
        border: 'border-emerald-200/80',
        icon: 'text-emerald-600',
        accent: '#10B981',
        surface: 'bg-emerald-50/70',
      },
      // Trust Cyan - Communication and reliability (#0891B2)
      cyan: {
        bg: 'bg-cyan-50',
        text: 'text-cyan-800',
        gradient: 'from-cyan-500/12 to-cyan-600/8',
        border: 'border-cyan-200/80',
        icon: 'text-cyan-600',
        accent: '#0891B2',
        surface: 'bg-cyan-50/70',
      },
      // Medical White variations for subtle differentiation
      neutral: {
        bg: 'bg-slate-50',
        text: 'text-slate-800',
        gradient: 'from-slate-400/8 to-slate-500/5',
        border: 'border-slate-200/80',
        icon: 'text-slate-600',
        accent: '#64748B',
        surface: 'bg-slate-50/70',
      },
      // Warm medical accent for pediatrics/family care
      warm: {
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        gradient: 'from-orange-400/10 to-orange-500/6',
        border: 'border-orange-200/80',
        icon: 'text-orange-600',
        accent: '#EA580C',
        surface: 'bg-orange-50/70',
      },
      // Professional purple for specialized care
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        gradient: 'from-purple-500/10 to-purple-600/6',
        border: 'border-purple-200/80',
        icon: 'text-purple-600',
        accent: '#9333EA',
        surface: 'bg-purple-50/70',
      },
    };
    return colorMap[color || 'blue'] || colorMap.blue;
  };

  const colors = getMedicalColors(department.color);

  // Enhanced medical specialty icons with premium visual hierarchy
  const getSpecialtyIcon = (name: string) => {
    const titleLower = name.toLowerCase();

    // Cardiology - Heart with pulse line for premium medical feel
    if (titleLower.includes('tim') || titleLower.includes('cardi')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Khoa Tim mạch"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M3.22 12h3.27l2 4 4-8 2 4h3.27" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );
    }
    // Neurology - Brain with neural network
    else if (titleLower.includes('não') || titleLower.includes('thần kinh') || titleLower.includes('neuro')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Khoa Thần kinh"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
          <path d="M8 12h8" strokeWidth="1.5" />
          <path d="M12 8v8" strokeWidth="1.5" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
          <circle cx="9" cy="15" r="1" fill="currentColor" />
          <circle cx="15" cy="15" r="1" fill="currentColor" />
        </svg>
      );
    }
    // Pediatrics - Child with care symbol
    else if (titleLower.includes('nhi') || titleLower.includes('trẻ em') || titleLower.includes('pediatr')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Khoa Nhi"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <path d="M8.5 15.5a2.5 2.5 0 0 1 7 0" />
          <path d="M12 12v3" strokeWidth="1.5" />
        </svg>
      );
    }
    // Ophthalmology - Eye with enhanced detail
    else if (titleLower.includes('mắt') || titleLower.includes('nhãn') || titleLower.includes('ophthal')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Khoa Mắt"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    }
    // Orthopedics - Bone structure
    else if (titleLower.includes('xương') || titleLower.includes('khớp') || titleLower.includes('orthop')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Khoa Xương khớp"
        >
          <path d="M17 12v5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-5" />
          <path d="M7 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5H7V7Z" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
        </svg>
      );
    }
    // Emergency - Medical cross with urgency indicator
    else if (titleLower.includes('cấp cứu') || titleLower.includes('emergency')) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon emergency-icon"
          role="img"
          aria-label="Khoa Cấp cứu"
        >
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
        </svg>
      );
    }
    // Default - Enhanced medical symbol
    else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="medical-specialty-icon"
          role="img"
          aria-label="Chuyên khoa y tế"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <path d="M12 11v6" strokeWidth="2" />
          <path d="M9 14h6" strokeWidth="2" />
        </svg>
      );
    }
  };

  // Get department priority level for visual hierarchy
  const getDepartmentPriority = (name: string) => {
    const titleLower = name.toLowerCase();
    if (titleLower.includes('cấp cứu') || titleLower.includes('emergency')) return 'emergency';
    if (titleLower.includes('tim') || titleLower.includes('cardi')) return 'critical';
    if (titleLower.includes('nhi') || titleLower.includes('trẻ em')) return 'priority';
    return 'standard';
  };

  // Get department title and priority
  const departmentTitle = decodeHTML(department.title.rendered);
  const priority = getDepartmentPriority(departmentTitle);

  // Enhanced styling based on priority level
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return {
          border: 'border-red-200 hover:border-red-300',
          shadow: 'shadow-red-100 hover:shadow-red-200/50',
          accent: 'bg-red-50',
          glow: 'hover:shadow-red-500/10',
        };
      case 'critical':
        return {
          border: 'border-blue-200 hover:border-blue-300',
          shadow: 'shadow-blue-100 hover:shadow-blue-200/50',
          accent: 'bg-blue-50',
          glow: 'hover:shadow-blue-500/10',
        };
      case 'priority':
        return {
          border: 'border-emerald-200 hover:border-emerald-300',
          shadow: 'shadow-emerald-100 hover:shadow-emerald-200/50',
          accent: 'bg-emerald-50',
          glow: 'hover:shadow-emerald-500/10',
        };
      default:
        return {
          border: 'border-gray-200 hover:border-gray-300',
          shadow: 'shadow-gray-100 hover:shadow-gray-200/50',
          accent: 'bg-gray-50',
          glow: 'hover:shadow-gray-500/10',
        };
    }
  };

  const priorityStyles = getPriorityStyles(priority);

  return (
    <TransitionLink
      to={`/department/${department.id}`}
      className="block w-full h-full focus:outline-none"
      aria-label={`Xem chi tiết ${departmentTitle}`}
    >
      <article
        className={combineClasses(
          'group',
          'relative flex flex-col rounded-xl overflow-hidden',
          'min-h-[150px] md:min-h-[160px] lg:min-h-[170px]', // Increased height for 3-line Vietnamese text
          `shadow-sm hover:shadow-lg ${priorityStyles.glow}`,
          'transition-all duration-300 ease-out',
          'border border-opacity-60',
          department.featuredImage ? 'border-gray-100' : priorityStyles.border,
          'hover:-translate-y-1 hover:border-opacity-100',
          department.featuredImage ? 'bg-cover bg-center' : `${colors.bg}`,
          'medical-department-card',
          priority === 'emergency' && 'ring-1 ring-red-200/50',
          priority === 'critical' && 'ring-1 ring-blue-200/50'
        )}
        style={
          department.featuredImage
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url(${department.featuredImage})`,
              }
            : undefined
        }
        role="article"
        aria-labelledby={`dept-title-${department.id}`}
        data-priority={priority}
        data-testid={`department-card-${department.id}`}
      >
        {/* Enhanced gradient background with semi-transparent panel */}
        {!department.featuredImage && (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}></div>
            <div className={`absolute inset-0 ${colors.surface} backdrop-blur-sm`}></div>
          </>
        )}

        {/* Compact content layout with improved density */}
        <div className={combineClasses('relative w-full h-full', 'p-3 md:p-4', 'flex flex-col justify-between z-10')}>
          {/* Enhanced department header with premium medical hierarchy */}
          <div className="flex items-start gap-3">
            {/* Premium medical specialty icon with priority indicator */}
            <div
              className={combineClasses(
                'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
                'transition-all duration-300 group-hover:scale-110',
                department.featuredImage
                  ? 'bg-white/25 backdrop-blur-sm border border-white/20'
                  : `${colors.surface} border ${colors.border}`,
                priority === 'emergency' && 'ring-2 ring-red-400/30',
                priority === 'critical' && 'ring-2 ring-blue-400/30'
              )}
              role="img"
              aria-hidden="true"
            >
              <div
                className={combineClasses(
                  'transition-colors duration-200',
                  department.featuredImage ? 'text-white' : colors.icon,
                  priority === 'emergency' && 'text-red-600',
                  priority === 'critical' && 'text-blue-600'
                )}
              >
                {getSpecialtyIcon(departmentTitle)}
              </div>
            </div>

            {/* Department information with enhanced typography hierarchy */}
            <div className="flex-1 min-w-0">
              {/* Priority badge for special departments */}
              {(priority === 'emergency' || priority === 'critical') && (
                <div
                  className={combineClasses(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium mb-1',
                    priority === 'emergency'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  )}
                >
                  <div
                    className={combineClasses(
                      'w-1.5 h-1.5 rounded-full',
                      priority === 'emergency' ? 'bg-red-500' : 'bg-blue-500'
                    )}
                  ></div>
                  <span>{priority === 'emergency' ? 'Cấp cứu' : 'Ưu tiên'}</span>
                </div>
              )}

              {/* Enhanced department name with maximum visual prominence */}
              <div className="relative">
                {/* Subtle background treatment for better contrast */}
                <div
                  className={combineClasses(
                    'absolute inset-0 rounded-lg opacity-60',
                    department.featuredImage ? 'bg-black/20 backdrop-blur-sm' : 'bg-white/80 border border-gray-100/50'
                  )}
                ></div>

                <h3
                  id={`dept-title-${department.id}`}
                  className={combineClasses(
                    'relative z-10 px-3 py-2.5',
                    'leading-snug font-black text-lg md:text-xl lg:text-2xl', // Optimized line height for Vietnamese text
                    'line-clamp-3 transition-all duration-300', // Increased to 3 lines for longer Vietnamese names
                    'tracking-normal', // Normal letter spacing for better Vietnamese readability
                    department.featuredImage
                      ? 'text-white drop-shadow-lg shadow-black/50'
                      : `${colors.text} text-shadow-sm`,
                    'group-hover:scale-[1.02] group-hover:text-opacity-95', // Reduced scale for better text readability
                    // Enhanced contrast and readability
                    priority === 'emergency' && !department.featuredImage && 'text-red-800',
                    priority === 'critical' && !department.featuredImage && 'text-blue-800',
                    // Premium typography treatment optimized for Vietnamese
                    'font-display antialiased break-words'
                  )}
                  style={{
                    textShadow: department.featuredImage
                      ? '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
                      : '0 1px 2px rgba(0,0,0,0.1)',
                    wordBreak: 'break-word', // Better handling of long Vietnamese words
                    hyphens: 'auto',
                  }}
                >
                  {departmentTitle}
                </h3>
              </div>

              {/* Optimized description for Vietnamese text */}
              {department.excerpt?.rendered && (
                <p
                  className={combineClasses(
                    'mt-3 text-sm font-medium line-clamp-2 transition-colors duration-200',
                    'leading-relaxed px-3', // Added padding to align with title
                    department.featuredImage ? 'text-white/85 drop-shadow-sm' : 'text-gray-700',
                    'group-hover:text-opacity-95'
                  )}
                  aria-describedby={`dept-title-${department.id}`}
                >
                  {decodeHTML(department.excerpt.rendered.replace(/<[^>]*>?/gm, '')).substring(0, 60)}...
                </p>
              )}
            </div>
          </div>

          {/* Streamlined action area with enhanced doctor count prominence */}
          <div className="flex items-center justify-start mt-4">
            {/* Enhanced doctor count badge with more prominence */}
            {department.acf?.doctor_count && (
              <div
                className={combineClasses(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold',
                  'transition-all duration-300 group-hover:scale-105',
                  department.featuredImage
                    ? 'bg-white/25 backdrop-blur-sm text-white/95 border border-white/30'
                    : `bg-white/95 ${colors.text} border ${colors.border} shadow-sm`,
                  'hover:shadow-md'
                )}
                role="status"
                aria-label={`${(department as any).acf?.doctor_count || 'Nhiều'} bác sĩ có sẵn`}
              >
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
                  className="medical-doctor-icon"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="font-bold">{(department as any).acf?.doctor_count || 'Nhiều'}</span>
                <span className="text-sm opacity-90">bác sĩ</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </TransitionLink>
  );
};

const FeaturedDepartents = () => {
  const [viewAll, setViewAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const departmentsData = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const departments = departmentsData || [];

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Loading state management
  useEffect(() => {
    if (departments.length > 0) {
      setIsLoading(false);
    }
  }, [departments]);

  // Process departments to extract featured image and assign premium healthcare colors
  const processedDepartments = departments.map((department, index) => {
    // Get featured image from embedded media if available
    const featuredImage = department._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

    // Assign premium healthcare color palette for optimal medical UI
    const healthcareColors = ['blue', 'green', 'cyan', 'neutral', 'warm', 'purple'];
    const color = healthcareColors[index % healthcareColors.length];

    return {
      ...department,
      featuredImage,
      color,
    };
  });

  const displayedDepartments = viewAll ? processedDepartments : processedDepartments.slice(0, 4);
  const hasMoreDepartments = processedDepartments.length > 6;

  // Loading skeleton component optimized for Vietnamese text display
  const DepartmentSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl h-[150px] md:h-[160px] lg:h-[170px] flex flex-col justify-between p-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-gray-300 rounded-xl"></div>
          <div className="flex-1">
            {/* Multi-line skeleton for Vietnamese department names */}
            <div className="h-6 md:h-7 lg:h-8 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-6 md:h-7 lg:h-8 bg-gray-300 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/5"></div>
          </div>
        </div>
        <div className="flex justify-start items-center">
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={combineClasses(
        'relative',
        // Enhanced medical color palette background
        'bg-white',
        // Medical blue border with trust-building cyan accent
        'border border-[#2563EB]/15',
        BORDER_RADIUS.cardLarge,
        'overflow-hidden',
        // Using unified width system for consistent spacing - matches services section
        MEDICAL_WIDTHS.section.padding,
        'my-4',
        // Enhanced shadow with medical blue tint
        'shadow-lg shadow-[#2563EB]/8'
      )}
    >
      <Section
        className="relative z-10"
        title="Các chuyên khoa"
        viewMore="/departments"
        accentColor="blue"
        spacing="compact" // Use compact spacing
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
        {/* Optimized grid layout for enhanced content density */}
        <div
          id="departments-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-3 medical-departments-grid"
          role="grid"
          aria-label="Danh sách các chuyên khoa y tế"
          aria-live="polite"
          aria-busy={isLoading ? 'true' : 'false'}
        >
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="medical-department-item"
                  role="gridcell"
                  aria-label="Đang tải thông tin chuyên khoa"
                >
                  <DepartmentSkeleton />
                </div>
              ))
            : // Actual department cards
              displayedDepartments.map((department, index) => (
                <div
                  key={department.id}
                  className="medical-department-item"
                  style={{
                    animationDelay: isVisible ? `${index * 60}ms` : '0ms',
                    opacity: isVisible ? 1 : 0,
                  }}
                  role="gridcell"
                  aria-rowindex={Math.floor(index / 4) + 1}
                  aria-colindex={(index % 4) + 1}
                >
                  <DepartmentCard department={department} />
                </div>
              ))}
        </div>

        {/* Compact view more button with enhanced accessibility */}
        {!viewAll && hasMoreDepartments && (
          <button
            onClick={() => setViewAll(true)}
            className={combineClasses(
              'mt-3 w-full min-h-[44px] py-2.5', // Reduced height and margin
              'rounded-lg', // Smaller border radius
              'bg-gradient-to-r from-blue-50 to-cyan-50',
              'border border-blue-200/80',
              'text-blue-700 hover:text-blue-900',
              'font-semibold text-sm',
              'hover:shadow-lg hover:shadow-blue-500/10',
              'hover:border-blue-300/80',
              'active:scale-[0.98]',
              'transition-all duration-250 ease-out',
              'flex items-center justify-center gap-2',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1',
              'medical-view-more-btn'
            )}
            aria-label="Xem thêm các chuyên khoa"
          >
            <span>Xem thêm ({processedDepartments.length - displayedDepartments.length})</span>
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
              className="transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </Section>

      {/* Enhanced Medical Department Styling with Accessibility */}
      <style>{`
        /* Medical department grid animation with reduced motion support */
        .medical-departments-grid {
          opacity: 0;
          animation: medicalGridFadeIn 0.5s ease-out 0.15s forwards;
        }

        @keyframes medicalGridFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Medical department item staggered animation */
        .medical-department-item {
          opacity: 0;
          transform: translateY(8px);
          animation: medicalDepartmentSlideIn 0.35s ease-out forwards;
        }

        @keyframes medicalDepartmentSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Enhanced medical department card with prominent typography */
        .medical-department-card {
          overflow: hidden;
          will-change: transform;
          position: relative;
        }

        /* Vietnamese text optimization for department names */
        .medical-department-card h3 {
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          line-break: auto;
        }

        /* Enhanced text shadow for better readability */
        .medical-department-card h3[style*="textShadow"] {
          filter: contrast(1.1) brightness(1.05);
        }

        /* Improved contrast for non-image cards */
        .medical-department-card:not([style*="backgroundImage"]) h3 {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        /* Priority-based title styling optimized for Vietnamese */
        .medical-department-card[data-priority="emergency"] h3 {
          font-weight: 900;
          letter-spacing: normal; /* Normal spacing for Vietnamese readability */
        }

        .medical-department-card[data-priority="critical"] h3 {
          font-weight: 800;
          letter-spacing: normal; /* Normal spacing for Vietnamese readability */
        }

        /* Enhanced line-clamp for Vietnamese text */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .medical-department-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          transition: left 0.5s ease-out;
          z-index: 1;
          pointer-events: none;
        }

        .medical-department-card:hover::before {
          left: 100%;
        }

        /* Subtle professional micro-animations */
        .medical-specialty-icon {
          animation: specialtyIconFloat 4s ease-in-out infinite;
        }

        @keyframes specialtyIconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(0.5deg); }
          75% { transform: translateY(-1px) rotate(-0.5deg); }
        }

        /* Medical doctor icon subtle animation */
        .medical-doctor-icon {
          animation: medicalDoctorIconPulse 2s ease-in-out infinite;
        }

        @keyframes medicalDoctorIconPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        /* Medical section icon professional animation */
        .medical-section-icon {
          animation: sectionIconRotate 8s linear infinite;
        }

        @keyframes sectionIconRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* View more button enhanced interaction */
        .medical-view-more-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        /* Emergency department special effects */
        .emergency-icon {
          animation: emergencyPulse 2s ease-in-out infinite;
        }

        @keyframes emergencyPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        /* Premium medical facility enhancements */
        .medical-department-card[data-priority="emergency"] {
          animation: emergencyGlow 3s ease-in-out infinite;
        }

        @keyframes emergencyGlow {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
          }
          50% {
            box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);
          }
        }

        .medical-department-card[data-priority="critical"] {
          animation: criticalShimmer 4s ease-in-out infinite;
        }

        @keyframes criticalShimmer {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
          }
          50% {
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
          }
        }

        /* Advanced performance optimizations */
        .medical-department-card {
          contain: layout style paint;
          will-change: transform, box-shadow;
          transform: translateZ(0); /* Force hardware acceleration */
          backface-visibility: hidden;
        }

        .medical-specialty-icon,
        .medical-doctor-icon {
          contain: layout style;
          transform: translateZ(0);
        }

        .medical-departments-grid {
          contain: layout;
        }

        /* Optimize animations for 60fps */
        @keyframes medicalGridFadeIn {
          from {
            opacity: 0;
            transform: translate3d(0, 12px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes medicalDepartmentSlideIn {
          from {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        /* Skeleton loading optimizations */
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Critical rendering path optimization */
        .medical-department-item {
          content-visibility: auto;
          contain-intrinsic-size: 120px;
        }

        /* Enhanced accessibility with WCAG 2.1 AA compliance */
        @media (prefers-reduced-motion: reduce) {
          .medical-departments-grid,
          .medical-department-item,
          .medical-specialty-icon,
          .medical-doctor-icon,
          .medical-section-icon,
          .medical-view-more-btn,
          .emergency-icon {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .medical-department-card::before {
            display: none;
          }

          .medical-department-card:hover,
          .medical-department-card[data-priority="emergency"],
          .medical-department-card[data-priority="critical"] {
            transform: none !important;
            animation: none !important;
          }
        }

        /* Keyboard navigation support */
        .medical-department-card:focus-within {
          outline: 3px solid ${getColorToken('primary')};
          outline-offset: 2px;
          box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.1);
          z-index: 10;
        }

        /* Enhanced focus states for streamlined cards */
        .medical-department-card:focus-within [role="status"] {
          background-color: rgba(37, 99, 235, 0.1);
          transform: scale(1.05);
        }

        /* Enhanced focus states for accessibility */
        .medical-department-card:focus-visible {
          outline: 3px solid ${getColorToken('primary')};
          outline-offset: 2px;
          box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.1);
        }

        .medical-view-more-btn:focus-visible {
          outline: 2px solid ${getColorToken('primary')};
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .medical-department-card {
            border-width: 2px;
            border-color: currentColor;
          }

          .medical-department-card:hover {
            border-color: ${getColorToken('primary')};
          }
        }

        /* Enhanced responsive design optimized for Vietnamese text */
        @media screen and (max-width: 480px) {
          .medical-department-card {
            min-height: 140px; /* Increased for 3-line Vietnamese text */
            padding: 0.75rem;
          }

          .medical-departments-grid {
            gap: 0.5rem;
            padding: 0 0.25rem;
          }

          .medical-view-more-btn {
            min-height: 48px;
            font-size: 0.875rem;
          }

          /* Mobile typography adjustments for Vietnamese text */
          .medical-department-card h3 {
            font-size: 1rem !important; /* Optimized for mobile Vietnamese text */
            line-height: 1.4 !important; /* Better line spacing for Vietnamese */
            padding: 0.5rem 0.75rem !important;
            letter-spacing: normal !important;
          }

          /* Adjust description for mobile */
          .medical-department-card p {
            font-size: 0.8rem !important;
            line-height: 1.3 !important;
          }

          /* Doctor count badge mobile optimization */
          .medical-department-card [role="status"] {
            font-size: 0.75rem !important;
            padding: 0.5rem 0.75rem !important;
          }
        }

        @media screen and (min-width: 768px) and (max-width: 1023px) {
          .medical-departments-grid {
            gap: 0.75rem;
          }
        }

        @media screen and (min-width: 1280px) {
          .medical-departments-grid {
            gap: 0.875rem;
          }

          .medical-department-card {
            min-height: 180px; /* Increased for 3-line Vietnamese text on large screens */
          }

          /* Enhanced typography for large screens with Vietnamese optimization */
          .medical-department-card h3 {
            font-size: 1.5rem !important; /* 24px for maximum prominence */
            line-height: 1.3 !important; /* Better line spacing for Vietnamese */
            letter-spacing: normal !important; /* Normal spacing for Vietnamese readability */
          }

          /* Enhanced description for large screens */
          .medical-department-card p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .medical-department-card:hover {
            transform: none;
          }

          .medical-department-card:active {
            transform: scale(0.98);
            transition: transform 0.1s ease-out;
          }

          .medical-view-more-btn:hover {
            transform: none;
          }

          .medical-view-more-btn:active {
            transform: scale(0.95);
          }
        }

        /* Print styles for accessibility */
        @media print {
          .medical-department-card {
            break-inside: avoid;
            border: 1px solid #000;
          }

          .medical-department-card::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedDepartents;
