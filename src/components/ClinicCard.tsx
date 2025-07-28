import React from 'react';
import { motion } from 'framer-motion';
import { Clinic } from '@/data/clinics';
import { getColorToken } from '@/styles/unified-color-system';

interface ClinicCardProps {
  clinic: Clinic;
  className?: string;
  onClick?: () => void;
}

const iconClass =
  'w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 shadow-sm medical-focus';

const SocialIcon = ({
  href,
  title,
  children,
  className,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${iconClass} ${className || ''}`}
    title={title}
    aria-label={title}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

export default function ClinicCard({ clinic, className = '', onClick }: ClinicCardProps) {
  const {
    name,
    address,
    phone,
    facebookUrl = '',
    zaloUrl = '',
    emailUrl = '',
    type,
    summerHours,
    winterHours,
  } = clinic;

  return (
    <motion.article
      className={`relative bg-surface rounded-2xl shadow-card p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 overflow-hidden group border border-border medical-card ${className}`}
      tabIndex={0}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Medical Status Indicator with unified colors */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('secondary')}, ${getColorToken('primary')})`,
        }}
      ></div>

      {/* Decorative Medical Elements with new colors */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 blur-xl group-hover:opacity-80 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 102, 204, 0.05)' }}
      ></div>
      <div
        className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-60 blur-xl group-hover:opacity-80 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 170, 68, 0.05)' }}
      ></div>

      {/* Medical Cross Pattern with unified color */}
      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill={getColorToken('primary')}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center text-left z-10">
        <header className="mb-3">
          <motion.span
            className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full mb-3 ${
              type === 'general'
                ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20'
                : 'bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary border border-secondary/20'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {type === 'general' ? 'Đa khoa' : 'Nha khoa'}
          </motion.span>
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-text-primary mb-2 leading-tight line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {name}
          </motion.h2>
        </header>

        <motion.div
          className="space-y-3 mb-4 sm:mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-start text-text-secondary text-sm sm:text-base">
            <svg
              className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="leading-relaxed">{address}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm sm:text-base">
            <svg
              className="w-5 h-5 text-primary mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <motion.a
              href={`tel:${phone}`}
              className="text-primary hover:text-primary-dark transition-colors font-medium medical-focus"
              aria-label={`Gọi điện thoại ${phone}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {phone}
            </motion.a>
          </div>

          {/* Operating Hours */}
          {(summerHours || winterHours) && (
            <motion.div
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center mb-2 sm:mb-3">
                <svg
                  className="w-5 h-5 text-primary mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-primary">Giờ làm việc:</h3>
              </div>
              <div className="flex flex-col space-y-2">
                {summerHours && (
                  <div className="flex items-center text-sm">
                    <span className="inline-block bg-gradient-to-r from-warning/10 to-warning/20 text-warning px-3 py-1 rounded-full text-xs font-medium mr-3 border border-warning/30">
                      Mùa Hè
                    </span>
                    <span className="text-text-secondary">{summerHours}</span>
                  </div>
                )}
                {winterHours && (
                  <div className="flex items-center text-sm">
                    <span className="inline-block bg-gradient-to-r from-info/10 to-info/20 text-info px-3 py-1 rounded-full text-xs font-medium mr-3 border border-info/30">
                      Mùa Đông
                    </span>
                    <span className="text-text-secondary">{winterHours}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Actions Section */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            {facebookUrl && (
              <SocialIcon href={facebookUrl} title="Facebook">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </SocialIcon>
            )}

            {zaloUrl && (
              <SocialIcon href={zaloUrl} title="Zalo">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 460.1 436.6" aria-hidden="true">
                  <style>{`.st0{fill:currentColor}.st1{fill:currentColor}.st2{fill:currentColor}.st3{fill:none;stroke:currentColor;stroke-width:2;stroke-miterlimit:10}`}</style>
                  <path
                    className="st0"
                    d="M82.6 380.9c-1.8-.8-3.1-1.7-1-3.5 1.3-1 2.7-1.9 4.1-2.8 13.1-8.5 25.4-17.8 33.5-31.5 6.8-11.4 5.7-18.1-2.8-26.5C69 269.2 48.2 212.5 58.6 145.5 64.5 107.7 81.8 75 107 46.6c15.2-17.2 33.3-31.1 53.1-42.7 1.2-.7 2.9-.9 3.1-2.7-.4-1-1.1-.7-1.7-.7-33.7 0-67.4-.7-101 .2C28.3 1.7.5 26.6.6 62.3c.2 104.3 0 208.6 0 313 0 32.4 24.7 59.5 57 60.7 27.3 1.1 54.6.2 82 .1 2 .1 4 .2 6 .2H290c36 0 72 .2 108 0 33.4 0 60.5-27 60.5-60.3v-.6-58.5c0-1.4.5-2.9-.4-4.4-1.8.1-2.5 1.6-3.5 2.6-19.4 19.5-42.3 35.2-67.4 46.3-61.5 27.1-124.1 29-187.6 7.2-5.5-2-11.5-2.2-17.2-.8-8.4 2.1-16.7 4.6-25 7.1-24.4 7.6-49.3 11-74.8 6zm72.5-168.5c1.7-2.2 2.6-3.5 3.6-4.8 13.1-16.6 26.2-33.2 39.3-49.9 3.8-4.8 7.6-9.7 10-15.5 2.8-6.6-.2-12.8-7-15.2-3-.9-6.2-1.3-9.4-1.1-17.8-.1-35.7-.1-53.5 0-2.5 0-5 .3-7.4.9-5.6 1.4-9 7.1-7.6 12.8 1 3.8 4 6.8 7.8 7.7 2.4.6 4.9.9 7.4.8 10.8.1 21.7 0 32.5.1 1.2 0 2.7-.8 3.6 1-.9 1.2-1.8 2.4-2.7 3.5-15.5 19.6-30.9 39.3-46.4 58.9-3.8 4.9-5.8 10.3-3 16.3s8.5 7.1 14.3 7.5c4.6.3 9.3.1 14 .1 16.2 0 32.3.1 48.5-.1 8.6-.1 13.2-5.3 12.3-13.3-.7-6.3-5-9.6-13-9.7-14.1-.1-28.2 0-43.3 0zm116-52.6c-12.5-10.9-26.3-11.6-39.8-3.6-16.4 9.6-22.4 25.3-20.4 43.5 1.9 17 9.3 30.9 27.1 36.6 11.1 3.6 21.4 2.3 30.5-5.1 2.4-1.9 3.1-1.5 4.8.6 3.3 4.2 9 5.8 14 3.9 5-1.5 8.3-6.1 8.3-11.3.1-20 .2-40 0-60-.1-8-7.6-13.1-15.4-11.5-4.3.9-6.7 3.8-9.1 6.9zm69.3 37.1c-.4 25 20.3 43.9 46.3 41.3 23.9-2.4 39.4-20.3 38.6-45.6-.8-25-19.4-42.1-44.9-41.3-23.9.7-40.8 19.9-40 45.6zm-8.8-19.9c0-15.7.1-31.3 0-47 0-8-5.1-13-12.7-12.9-7.4.1-12.3 5.1-12.4 12.8-.1 4.7 0 9.3 0 14v79.5c0 6.2 3.8 11.6 8.8 12.9 6.9 1.9 14-2.2 15.8-9.1.3-1.2.5-2.4.4-3.7.2-15.5.1-31 .1-46.5z"
                  />
                </svg>
              </SocialIcon>
            )}

            {emailUrl && (
              <SocialIcon href={emailUrl} title="Email">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </SocialIcon>
            )}
          </div>

          {/* Enhanced Call Button */}
          <motion.a
            href={`tel:${phone}`}
            className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-button hover:shadow-button-hover transition-all medical-focus"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Gọi điện thoại ${phone}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Gọi ngay
          </motion.a>
        </motion.div>
      </div>
    </motion.article>
  );
}
