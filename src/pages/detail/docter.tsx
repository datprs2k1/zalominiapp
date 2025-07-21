import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import NotFound from '../404';
import TransitionLink from '@/components/transition-link';
import { doctorAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import { decodeHTML } from '@/utils/decodeHTML';
import React from 'react';

// Doctor data interface
interface DoctorData {
  title?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: { 'wp:featuredmedia'?: { source_url?: string }[] };
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
}

// Contact button props
interface ContactButtonProps {
  href: string;
  className: string;
  title: string;
  icon: React.ReactNode;
  label: string;
}

// Contact button component
const ContactButton = ({ href, className, title, icon, label }: ContactButtonProps) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className={className}
    title={title}
  >
    {icon}
    {label}
  </a>
);

// InfoRow component
const InfoRow = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[8rem_auto]">
      <span className="font-medium text-gray-700 text-left">{label}:</span>
      <span className="text-blue-700 font-medium text-left">{value}</span>
    </div>
  );
};

// Section component
const Section = ({
  title,
  icon = null,
  className = '',
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={`px-4 md:px-0 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-700 mb-3 md:mb-4 border-b pb-2 flex items-center">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

function DoctorDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    return <div className="text-center my-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <NotFound />;
  }

  const doctor = data as DoctorData;

  // Extract doctor data
  const avatar = doctor?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const name = doctor?.title?.rendered ? decodeHTML(doctor.title.rendered) : '';
  const description = doctor?.content?.rendered ? decodeHTML(doctor.content.rendered) : '';
  const department = doctor?.department || '';
  const phone = doctor?.phone || '';
  const email = doctor?.email || '';
  const facebook = doctor?.facebook || '';
  const zalo = doctor?.zalo || '';
  const position = doctor?.bacsi_chucdanh || '';
  const unit = doctor?.bacsi_donvi || '';
  const experience = doctor?.bacsi_kinhnghiem?.replace('\n', '<br>') || '';

  // Icons
  const phoneIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1"
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
  );

  const phoneIconLarge = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );

  const emailIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1"
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
  );

  const emailIconLarge = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const facebookIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const facebookIconLarge = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const zaloIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1"
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
  );

  const zaloIconLarge = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );

  const experienceIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6m0 0V8m0 0h-6m6 0H9"
      />
    </svg>
  );

  const calendarIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
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
  );

  // Contact button configurations for mobile
  const mobileContactButtons = [
    phone && {
      href: `tel:${phone}`,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      title: 'Gọi điện',
      icon: phoneIcon,
      label: 'Gọi điện',
    },
    email && {
      href: `mailto:${email}`,
      className: 'bg-blue-400 hover:bg-blue-500 text-white',
      title: 'Gửi email',
      icon: emailIcon,
      label: 'Email',
    },
    facebook && {
      href: facebook,
      className: 'bg-blue-700 hover:bg-blue-800 text-white',
      title: 'Facebook',
      icon: facebookIcon,
      label: 'Facebook',
    },
    zalo && {
      href: zalo,
      className: 'bg-green-500 hover:bg-green-600 text-white',
      title: 'Zalo',
      icon: zaloIcon,
      label: 'Zalo',
    },
  ].filter(Boolean) as ContactButtonProps[];

  // Contact button configurations for desktop
  const desktopContactButtons = [
    phone && {
      href: `tel:${phone}`,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      title: 'Gọi điện',
      icon: phoneIconLarge,
      label: 'Gọi điện',
    },
    email && {
      href: `mailto:${email}`,
      className: 'bg-blue-400 hover:bg-blue-500 text-white',
      title: 'Gửi email',
      icon: emailIconLarge,
      label: 'Email',
    },
    facebook && {
      href: facebook,
      className: 'bg-blue-700 hover:bg-blue-800 text-white',
      title: 'Facebook',
      icon: facebookIconLarge,
      label: 'Facebook',
    },
    zalo && {
      href: zalo,
      className: 'bg-green-500 hover:bg-green-600 text-white',
      title: 'Zalo',
      icon: zaloIconLarge,
      label: 'Zalo',
    },
  ].filter(Boolean) as ContactButtonProps[];

  return (
    <div className="overflow-x-hidden">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-4 md:mt-10 p-0 md:p-8 space-y-6 md:space-y-8 border border-blue-100">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start p-4 md:p-0">
          {/* Avatar */}
          <div className="w-full md:w-1/3">
            <div className="w-full h-[300px] md:h-[350px]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-auto rounded-lg object-contain border-2 border-blue-200 shadow-lg mb-3 md:mb-4 bg-white mx-auto"
                />
              ) : (
                <div className="h-full w-auto rounded-lg bg-blue-100 flex items-center justify-center text-5xl text-blue-400 mb-3 md:mb-4 shadow-lg mx-auto">
                  ?
                </div>
              )}
            </div>

            {/* Mobile contact buttons */}
            <div className="grid md:hidden grid-cols-2 gap-3 mt-3 w-full max-w-xs mx-auto">
              {mobileContactButtons.map((button, index) => (
                <ContactButton
                  key={index}
                  href={button.href}
                  className={`${button.className} rounded-lg px-3 py-2 shadow-md transition text-sm font-medium flex items-center justify-center`}
                  title={button.title}
                  icon={button.icon}
                  label={button.label}
                />
              ))}
            </div>
          </div>

          {/* Doctor information */}
          <div className="flex-1 w-full md:w-2/3 flex flex-col justify-center items-start gap-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-1 text-left">{name}</h1>

            {/* Professional information */}
            <div className="w-full space-y-3 border-b border-gray-200 pb-4 mb-3">
              <InfoRow label="Chức danh" value={position} />
              <InfoRow label="Đơn vị" value={unit || department} />
            </div>

            {/* Desktop contact buttons */}
            <div className="hidden md:flex gap-4">
              {desktopContactButtons.map((button, index) => (
                <ContactButton
                  key={index}
                  href={button.href}
                  className={`${button.className} flex items-center gap-2 rounded-lg px-5 py-2 shadow-md transition text-base font-medium`}
                  title={button.title}
                  icon={button.icon}
                  label={button.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Experience section */}
        {experience && (
          <Section title="Kinh nghiệm chuyên môn" icon={experienceIcon} className="bg-blue-50 rounded-xl p-4 md:p-6">
            <div
              className="prose prose-sm md:prose-base prose-blue max-w-none text-gray-700 break-words"
              dangerouslySetInnerHTML={{ __html: normalizeHtml(experience) }}
            />
          </Section>
        )}

        {/* Description section */}
        <Section title="Giới thiệu">
          <div
            className="prose prose-sm md:prose-base prose-blue max-w-none text-gray-700 break-words"
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: normalizeHtml(description) }}
          />
        </Section>

        {/* Booking button */}
        <div className="px-4 md:px-0 flex justify-center pb-4 sticky bottom-4 md:static md:bottom-auto">
          <TransitionLink
            to={`/booking?doctor=${id}`}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 md:px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
          >
            {calendarIcon}
            Đặt lịch khám
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetailPage;
