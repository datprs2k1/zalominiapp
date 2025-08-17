import { useEffect, useState } from 'react';
import { serviceByIdState, symptomFormState } from '@/state';
import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import DetailPageTemplate from './template';
import { doctorAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import TransitionLink from '@/components/transition-link';
import { Container, Card, Loading, StatusBadge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useDeviceInfo } from '@/utils/device-detection';
function DoctorDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const deviceInfo = useDeviceInfo();

  const data = useAtomValue(doctorAtomFamily(Number(id)));

  useEffect(() => {
    if (data === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
      setError(!data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <Card className="text-center py-12 w-full max-w-sm mx-auto shadow-lg border-0">
          <Loading variant="spinner" size="lg" text="Đang tải thông tin bác sĩ..." />
        </Card>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  // data là object với các trường title, content, department (theo WP REST API)
  const doctor = data as {
    title?: { rendered?: string };
    content?: { rendered?: string };
    _embedded?: { 'wp:featuredmedia'?: any[] };
    department?: string;
    phone?: string;
    email?: string;
    facebook?: string;
    zalo?: string;
    bacsi_chucdanh?: string;
    bacsi_chuyenmon?: string;
    bacsi_donvi?: string;
    bacsi_kinhnghiem?: string;
    [key: string]: any;
  };

  const avatar = doctor?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const name = doctor?.title?.rendered || '';
  const description = doctor?.content?.rendered || '';
  const department = doctor?.department || '';
  const phone = doctor?.phone || '';
  const email = doctor?.email || '';
  const facebook = doctor?.facebook || '';
  const zalo = doctor?.zalo || '';
  const position = doctor?.bacsi_chucdanh || '';
  // const specialization = doctor?.bacsi_chuyenmon || '';
  const specialization = '';
  const unit = doctor?.bacsi_donvi || '';
  const experience = doctor?.bacsi_kinhnghiem || '';

  // Mobile-optimized classes based on device info
  const isMobile = deviceInfo.type === 'mobile';
  const isTouch = deviceInfo.isTouch;

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-25 to-white min-h-screen">
      {/* Mobile-first container with safe area padding */}
      <div className="safe-area-padding">
        <Container maxWidth="xl" padding={isMobile ? 'sm' : 'lg'}>
          <Card
            className={cn(
              'mt-2 md:mt-10 space-y-4 md:space-y-8 border-0 shadow-xl',
              'bg-white/95 backdrop-blur-sm',
              isMobile && 'mx-2 rounded-2xl'
            )}
            padding={isMobile ? 'md' : 'lg'}
          >
            <div
              className={cn(
                'flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start',
                isMobile ? 'p-2' : 'p-4 md:p-0'
              )}
            >
              {/* Avatar section with enhanced mobile design */}
              <div className="flex-shrink-0 flex flex-col items-center w-full md:w-1/3">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className={cn(
                        'object-cover bg-white shadow-2xl border-4 border-white',
                        'rounded-3xl',
                        isMobile ? 'w-32 h-32' : 'w-40 h-40 md:w-48 md:h-48'
                      )}
                      style={{ aspectRatio: '1/1' }}
                    />
                  ) : (
                    <div
                      className={cn(
                        'bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center',
                        'border-4 border-white shadow-2xl rounded-3xl',
                        isMobile ? 'w-32 h-32' : 'w-40 h-40 md:w-48 md:h-48'
                      )}
                    >
                      <svg
                        className={cn('text-blue-500', isMobile ? 'w-12 h-12' : 'w-16 h-16')}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>
                </div>
                {/* Enhanced mobile contact buttons with better touch targets */}
                <div
                  className={cn(
                    'grid md:hidden gap-3 mt-4 w-full mx-auto',
                    phone && email && facebook && zalo
                      ? 'grid-cols-2'
                      : (phone || email || facebook || zalo) &&
                          [phone, email, facebook, zalo].filter(Boolean).length === 3
                        ? 'grid-cols-3'
                        : 'grid-cols-2',
                    'max-w-sm'
                  )}
                >
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className={cn(
                        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                        'text-white rounded-2xl px-4 py-3 shadow-lg transition-all duration-200',
                        'text-sm font-semibold flex items-center justify-center gap-2',
                        'transform hover:scale-105 active:scale-95',
                        isTouch && 'comfortable-touch-target'
                      )}
                      title="Gọi điện"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {isMobile ? 'Gọi' : 'Gọi điện'}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className={cn(
                        'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600',
                        'text-white rounded-2xl px-4 py-3 shadow-lg transition-all duration-200',
                        'text-sm font-semibold flex items-center justify-center gap-2',
                        'transform hover:scale-105 active:scale-95',
                        isTouch && 'comfortable-touch-target'
                      )}
                      title="Gửi email"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900',
                        'text-white rounded-2xl px-4 py-3 shadow-lg transition-all duration-200',
                        'text-sm font-semibold flex items-center justify-center gap-2',
                        'transform hover:scale-105 active:scale-95',
                        isTouch && 'comfortable-touch-target'
                      )}
                      title="Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </a>
                  )}
                  {zalo && (
                    <a
                      href={zalo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                        'text-white rounded-2xl px-4 py-3 shadow-lg transition-all duration-200',
                        'text-sm font-semibold flex items-center justify-center gap-2',
                        'transform hover:scale-105 active:scale-95',
                        isTouch && 'comfortable-touch-target'
                      )}
                      title="Zalo"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Zalo
                    </a>
                  )}
                </div>
              </div>

              {/* Doctor information section with enhanced mobile design */}
              <div className="flex-1 w-full md:w-2/3 flex flex-col justify-center items-start gap-3 md:gap-4">
                <div className="w-full text-center md:text-left">
                  <h1 className={cn('font-bold text-gray-800 mb-2', isMobile ? 'text-2xl leading-tight' : 'text-3xl')}>
                    {name}
                  </h1>

                  {/* Quick status badge */}
                  <div className="flex justify-center md:justify-start mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Đang hoạt động
                    </span>
                  </div>
                </div>

                {/* Professional information with enhanced mobile layout */}
                <div
                  className={cn(
                    'w-full space-y-3 border-b border-blue-100 pb-4 mb-3',
                    'bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl p-4'
                  )}
                >
                  {position && (
                    <div className={cn('grid gap-1', isMobile ? 'grid-cols-1' : 'md:grid-cols-[8rem_auto]')}>
                      <span className="font-medium text-gray-600 text-sm">Chức danh:</span>
                      <span className="text-blue-700 font-semibold">{position}</span>
                    </div>
                  )}

                  {specialization && (
                    <div className={cn('grid gap-1', isMobile ? 'grid-cols-1' : 'md:grid-cols-[8rem_auto]')}>
                      <span className="font-medium text-gray-600 text-sm">Chuyên môn:</span>
                      <span className="text-blue-700 font-semibold">{specialization}</span>
                    </div>
                  )}

                  {unit || department ? (
                    <div className={cn('grid gap-1', isMobile ? 'grid-cols-1' : 'md:grid-cols-[8rem_auto]')}>
                      <span className="font-medium text-gray-600 text-sm">Đơn vị:</span>
                      <span className="text-blue-700 font-semibold">{unit || department}</span>
                    </div>
                  ) : null}

                  {experience && (
                    <div className={cn('grid gap-1', isMobile ? 'grid-cols-1' : 'md:grid-cols-[8rem_auto]')}>
                      <span className="font-medium text-gray-600 text-sm">Kinh nghiệm:</span>
                      <span className="text-blue-700 font-semibold">{experience}</span>
                    </div>
                  )}
                </div>

                {/* Enhanced desktop contact buttons */}
                {(phone || email || facebook || zalo) && (
                  <div className="hidden md:flex gap-3 mt-6 flex-wrap">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-200 text-base font-semibold transform hover:scale-105"
                        title="Gọi điện"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Gọi điện
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-200 text-base font-semibold transform hover:scale-105"
                        title="Gửi email"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </a>
                    )}
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-200 text-base font-semibold transform hover:scale-105"
                        title="Facebook"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>
                    )}
                    {zalo && (
                      <a
                        href={zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-200 text-base font-semibold transform hover:scale-105"
                        title="Zalo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Zalo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced description section with mobile optimization */}
            <section
              className={cn(
                'bg-gradient-to-r from-blue-50/30 to-transparent rounded-2xl',
                isMobile ? 'px-2 py-4' : 'px-6 py-6'
              )}
            >
              <h2
                className={cn(
                  'font-bold text-gray-800 mb-4 pb-3 border-b border-blue-200',
                  'flex items-center gap-2',
                  isMobile ? 'text-lg' : 'text-xl'
                )}
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Giới thiệu
              </h2>
              <div
                className={cn(
                  'prose prose-blue max-w-none text-gray-700 break-words leading-relaxed',
                  isMobile ? 'prose-sm text-sm' : 'prose-base'
                )}
                style={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: normalizeHtml(description) }}
              />
            </section>

            {/* Enhanced booking button with mobile-first design */}
            <div className={cn('flex justify-center pb-4', isMobile ? 'sticky bottom-4 px-2' : 'static px-4 md:px-0')}>
              <TransitionLink
                to={`/booking?doctor=${id}`}
                className={cn(
                  'mt-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
                  'hover:from-blue-700 hover:via-blue-800 hover:to-blue-900',
                  'text-white font-bold shadow-2xl transition-all duration-300',
                  'flex items-center justify-center gap-3',
                  'transform hover:scale-105 active:scale-95',
                  'border-2 border-blue-500/20',
                  isMobile
                    ? [
                        'py-4 px-6 rounded-2xl w-full max-w-sm mx-auto',
                        'text-lg shadow-lg backdrop-blur-sm',
                        isTouch && 'comfortable-touch-target',
                      ]
                    : ['py-3 px-8 rounded-xl w-auto', 'text-base']
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn('animate-pulse', isMobile ? 'h-6 w-6' : 'h-5 w-5')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Đặt lịch khám</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </TransitionLink>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default DoctorDetailPage;
