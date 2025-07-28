import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import NotFound from '../404';
import TransitionLink from '@/components/transition-link';
import { Skeleton } from '@/components/loading-states';
import APIDebug from '@/components/debug/api-debug';
import { doctorAtomFamily } from '@/services/doctors';
import { EnhancedDoctor } from '@/services/doctors';
import normalizeHtml from '@/utils/normalHTML';
import { decodeHTML } from '@/utils/decodeHTML';
import {
  MedicalCrossIcon,
  StethoscopeIcon,
  HeartIcon,
  MedicalShieldIcon,
  AppointmentIcon,
  ExperienceIcon,
  MedicalFeeIcon,
  OnlineStatusIcon,
  StarIcon,
} from '@/components/medical-icons';

// Import test functions in development mode
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  import('@/utils/api-test').then((module) => {
    (window as any).testDoctorAPI = module.quickTestDoctor;
    (window as any).runAPITests = module.runAPITests;
    (window as any).testDirectDoctorAPI = module.testDirectDoctorAPI;
  });
}
import './doctor-mobile.css';

// Use EnhancedDoctor type from services
type DoctorData = EnhancedDoctor;

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
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-surface-medical"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Enhanced Mobile Hero Skeleton with Medical Theme */}
        <div className="md:hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-black/5 to-transparent"></div>

          {/* Enhanced Medical Cross Pattern Overlay */}
          <div className="absolute inset-0 opacity-8">
            <div className="absolute top-16 right-16 w-6 h-6">
              <MedicalCrossIcon className="text-white w-full h-full" />
            </div>
            <div className="absolute bottom-20 left-12 w-4 h-4">
              <HeartIcon className="text-white w-full h-full" />
            </div>
            <div className="absolute top-1/3 left-1/4 w-5 h-5">
              <StethoscopeIcon className="text-white w-full h-full" />
            </div>
          </div>

          <div className="relative z-10 p-6 pb-8">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-16 h-16 rounded-xl border-3 border-white/40 shadow-lg bg-white/10 backdrop-blur-sm"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="flex-1 space-y-3">
                <motion.div
                  className="h-6 bg-white/25 rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                />
                <motion.div
                  className="h-4 bg-white/20 w-3/4 rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                />
                <motion.div
                  className="h-3 bg-white/15 w-1/2 rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Desktop Layout Skeleton with Medical Theme */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-medical hidden md:block">
            {/* Hero Section Skeleton */}
            <div className="relative h-80 bg-gradient-to-br from-primary-50 via-background-secondary to-surface-medical overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 to-transparent"></div>

              {/* Medical Pattern Overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-12 right-20 w-8 h-8">
                  <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
                  </svg>
                </div>
                <div className="absolute bottom-16 left-16 w-6 h-6">
                  <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
                  </svg>
                </div>
              </div>

              {/* Floating Doctor Card Skeleton */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30">
                <div className="flex items-center gap-5">
                  <Skeleton variant="image" className="w-18 h-18 rounded-xl shadow-lg border-3 border-white" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" lines={1} className="h-6 w-3/4 rounded-lg" />
                    <Skeleton variant="text" lines={1} className="h-4 w-1/2 rounded-lg" />
                    <Skeleton variant="text" lines={1} className="h-3 w-2/3 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section Skeleton */}
            <div className="p-8">
              <div className="flex gap-10">
                {/* Proportional Side Image Skeleton */}
                <div className="w-80 flex-shrink-0">
                  <Skeleton variant="image" className="w-full h-[400px] rounded-2xl shadow-xl border-3 border-white" />
                </div>

                {/* Info Cards Skeleton */}
                <div className="flex-1 space-y-6">
                  <div className="bg-gradient-to-r from-secondary-50 to-accent-50 rounded-2xl p-5 border border-secondary-200">
                    <Skeleton variant="text" lines={2} className="rounded-lg" />
                  </div>
                  <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-5 border border-accent-200">
                    <Skeleton variant="text" lines={2} className="rounded-lg" />
                  </div>
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-5 border border-primary-200">
                    <Skeleton variant="text" lines={2} className="rounded-lg" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Skeleton variant="button" className="w-36 h-14 rounded-2xl" />
                    <Skeleton variant="button" className="w-36 h-14 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Skeleton with Medical Theme */}
          <div className="space-y-8 mt-8">
            <div className="bg-gradient-to-r from-secondary-50 via-accent-50 to-secondary-50 rounded-3xl p-8 border border-secondary-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <Skeleton variant="text" lines={1} className="h-7 w-48 rounded-lg" />
              </div>
              <Skeleton variant="text" lines={4} className="rounded-lg" />
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-border-medical">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <Skeleton variant="text" lines={1} className="h-7 w-32 rounded-lg" />
              </div>
              <Skeleton variant="text" lines={6} className="rounded-lg" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  const doctor = data as DoctorData;

  // Extract doctor data using enhanced fields
  const avatar = doctor?.featuredImageUrl;
  const name = doctor?.title?.rendered ? decodeHTML(doctor.title.rendered) : '';
  const description = doctor?.content?.rendered ? decodeHTML(doctor.content.rendered) : '';
  const department = doctor?.departmentInfo?.name || '';
  const position = doctor?.bacsi_chucdanh || '';
  const unit = doctor?.bacsi_donvi || doctor?.departmentInfo?.name || '';
  const experience = doctor?.experience?.description?.replace(/\n/g, '<br>') || '';
  const consultationFee = doctor?.consultationFee;

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Chuyển đến nội dung chính
      </a>

      <motion.div
        id="main-content"
        className="min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        role="main"
        aria-label={`Thông tin chi tiết bác sĩ ${name}`}
      >
        {/* Redesigned Mobile Hero Section - Clean Hospital Design */}
        <div className="md:hidden relative overflow-hidden">
          {/* Enhanced Medical Hero Background */}
          <div className="relative bg-gradient-to-br from-white via-blue-50/60 to-emerald-50/40 border-b border-blue-100/50">
            {/* Refined Medical Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute top-8 right-8 w-14 h-14">
                <MedicalCrossIcon className="text-blue-500 w-full h-full" />
              </div>
              <div className="absolute bottom-12 left-8 w-10 h-10">
                <HeartIcon className="text-emerald-500 w-full h-full" />
              </div>
              <div className="absolute top-1/3 right-1/4 w-8 h-8">
                <StethoscopeIcon className="text-blue-400 w-full h-full" />
              </div>
              <div className="absolute top-1/2 left-1/3 w-6 h-6">
                <MedicalShieldIcon className="text-emerald-400 w-full h-full" />
              </div>
            </div>

            {/* Enhanced Geometric Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-100/15 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-emerald-100/15 to-transparent rounded-full translate-y-28 -translate-x-28"></div>
              <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-blue-50/20 to-transparent rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-6 pt-12 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Doctor Avatar */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="relative">
                    {avatar ? (
                      <motion.img
                        src={avatar}
                        alt={name}
                        className="w-52 h-64 rounded-3xl object-cover shadow-2xl border-4 border-white ring-4 ring-blue-100/60"
                        loading="lazy"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      />
                    ) : (
                      <div className="w-52 h-64 rounded-3xl bg-gradient-to-br from-blue-100/80 to-emerald-100/80 flex items-center justify-center text-6xl shadow-2xl border-4 border-white ring-4 ring-blue-100/60">
                        👨‍⚕️
                      </div>
                    )}

                    {/* Professional Status Badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-2 shadow-lg border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Doctor Information */}
                <div className="flex-1 space-y-2">
                  <motion.h1
                    id="doctor-name-mobile"
                    className="text-2xl font-bold text-slate-800 leading-tight high-contrast-text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    tabIndex={0}
                    aria-label={`Bác sĩ ${name}`}
                    role="heading"
                    aria-level={1}
                  >
                    {name}
                  </motion.h1>

                  {position && (
                    <motion.p
                      className="text-base font-semibold text-blue-700"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                    >
                      {position}
                    </motion.p>
                  )}

                  {(unit || department) && (
                    <motion.p
                      className="text-sm text-slate-600 font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      {unit || department}
                    </motion.p>
                  )}

                  {/* Enhanced Professional Credentials */}
                  <motion.div
                    className="flex flex-wrap gap-2 mt-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                  >
                    <div className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-xl px-3 py-1.5 border border-amber-200/60 shadow-sm">
                      <StarIcon className="text-amber-500" size="sm" />
                      <span className="text-xs font-semibold text-amber-700">Chuyên gia</span>
                    </div>

                    {consultationFee && (
                      <div className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-xl px-3 py-1.5 border border-emerald-200/60 shadow-sm">
                        <MedicalFeeIcon className="text-emerald-600" size="sm" />
                        <span className="text-xs font-semibold text-emerald-700">
                          {consultationFee.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl px-3 py-1.5 border border-blue-200/60 shadow-sm">
                      <OnlineStatusIcon className="text-blue-500" size="sm" />
                      <span className="text-xs font-semibold text-blue-700">Đã xác thực</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Quick Stats Cards */}
              <motion.div
                className="grid grid-cols-3 gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-blue-100/50 text-center hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExperienceIcon className="text-blue-600" size="sm" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Kinh nghiệm</p>
                  <p className="text-sm font-bold text-slate-800">10+ năm</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <OnlineStatusIcon className="text-emerald-600" size="sm" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Trạng thái</p>
                  <p className="text-sm font-bold text-emerald-600">Hoạt động</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-purple-100/50 text-center hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-1.5">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <AppointmentIcon className="text-purple-600" size="sm" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Đặt lịch</p>
                  <p className="text-sm font-bold text-purple-600">Có sẵn</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Redesigned Desktop Layout - Modern Clean Hospital Interface */}
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <motion.div
            className="hidden md:block bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Enhanced Modern Clean Hero Section */}
            <div className="relative bg-gradient-to-br from-white via-blue-50/60 to-emerald-50/40 overflow-hidden">
              {/* Subtle Medical Pattern Background */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-8 right-12 w-16 h-16">
                  <MedicalCrossIcon className="text-blue-600 w-full h-full" />
                </div>
                <div className="absolute bottom-12 left-8 w-12 h-12">
                  <HeartIcon className="text-emerald-600 w-full h-full" />
                </div>
                <div className="absolute top-1/3 right-1/4 w-10 h-10">
                  <StethoscopeIcon className="text-slate-600 w-full h-full" />
                </div>
              </div>

              {/* Clean Geometric Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/15 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-100/15 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
              </div>

              {/* Main Content Container */}
              <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Doctor Avatar Section */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="relative">
                      {avatar ? (
                        <motion.img
                          src={avatar}
                          alt={name}
                          className="w-64 h-64 rounded-3xl object-cover shadow-2xl border-4 border-white ring-4 ring-blue-100/60"
                          loading="lazy"
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        />
                      ) : (
                        <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-blue-100/80 to-emerald-100/80 flex items-center justify-center text-8xl shadow-2xl border-4 border-white ring-4 ring-blue-100/60">
                          👨‍⚕️
                        </div>
                      )}

                      {/* Professional Status Badge */}
                      <motion.div
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-2 shadow-lg border-2 border-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>

                      {/* Medical Degree Badge */}
                      <motion.div
                        className="absolute -bottom-2 -left-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full px-3 py-1 shadow-lg border-2 border-white"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <span className="text-xs font-bold text-white">MD</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Doctor Information */}
                  <div className="flex-1 space-y-4">
                    <motion.h1
                      id="doctor-name-desktop"
                      className="text-4xl font-bold text-slate-800 leading-tight"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      tabIndex={0}
                      aria-label={`Bác sĩ ${name}`}
                      role="heading"
                      aria-level={1}
                    >
                      {name}
                    </motion.h1>

                    {position && (
                      <motion.p
                        className="text-xl font-semibold text-blue-700"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                      >
                        {position}
                      </motion.p>
                    )}

                    {(unit || department) && (
                      <motion.p
                        className="text-lg text-slate-600 font-medium"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                      >
                        {unit || department}
                      </motion.p>
                    )}

                    {/* Enhanced Professional Credentials Cards */}
                    <motion.div
                      className="flex items-center gap-3 flex-wrap"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.7 }}
                    >
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-xl px-4 py-2.5 border border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                        <StarIcon className="text-amber-500" size="sm" />
                        <span className="text-sm font-semibold text-amber-700">Chuyên gia</span>
                      </div>

                      {consultationFee && (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-xl px-4 py-2.5 border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                          <MedicalFeeIcon className="text-emerald-600" size="sm" />
                          <span className="text-sm font-semibold text-emerald-700">
                            {consultationFee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl px-4 py-2.5 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                        <OnlineStatusIcon className="text-blue-500" size="sm" />
                        <span className="text-sm font-semibold text-blue-700">Đã xác thực</span>
                      </div>
                    </motion.div>

                    {/* Enhanced Quick Stats Grid */}
                    <motion.div
                      className="grid grid-cols-3 gap-4 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.7 }}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            <ExperienceIcon className="text-blue-600" size="md" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium text-center">Kinh nghiệm</p>
                        <p className="text-sm font-bold text-slate-800 text-center">10+ năm</p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-emerald-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <OnlineStatusIcon className="text-emerald-600" size="md" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium text-center">Trạng thái</p>
                        <p className="text-sm font-bold text-emerald-600 text-center">Hoạt động</p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                            <AppointmentIcon className="text-purple-600" size="md" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium text-center">Đặt lịch</p>
                        <p className="text-sm font-bold text-purple-600 text-center">Có sẵn</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Content Sections with Professional Medical Design */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10 pb-32 md:pb-16">
          {/* Enhanced Experience Section with Medical Theme & Accessibility */}
          {experience && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <section
                className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 rounded-3xl p-8 md:p-10 border border-primary-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                aria-labelledby="experience-heading"
                role="region"
              >
                {/* Enhanced Section Header with Medical Icons */}
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary to-primary-600 rounded-3xl flex items-center justify-center mr-5 shadow-xl">
                    <ExperienceIcon className="text-white" size="lg" />
                  </div>
                  <div className="flex-1">
                    <h2 id="experience-heading" className="text-3xl font-bold text-gray-800 mb-1" tabIndex={0}>
                      Kinh nghiệm chuyên môn
                    </h2>
                    <p className="text-primary font-medium">Chuyên môn và thành tựu</p>
                  </div>
                  {/* Medical Cross Decoration */}
                  <div className="w-6 h-6 opacity-20">
                    <MedicalCrossIcon className="text-primary" size="md" />
                  </div>
                </div>

                {/* Enhanced Medical Divider with Cross Pattern */}
                <div className="flex items-center mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
                  <div className="mx-4 w-4 h-4 opacity-40">
                    <MedicalCrossIcon className="text-primary" size="sm" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
                </div>

                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: normalizeHtml(experience) }}
                  role="article"
                  aria-label="Kinh nghiệm chuyên môn của bác sĩ"
                />
              </section>
            </motion.div>
          )}

          {/* Enhanced Description Section with Medical Theme & Accessibility */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <section
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-border-medical hover:shadow-2xl transition-all duration-300"
              aria-labelledby="description-heading"
              role="region"
            >
              {/* Enhanced Section Header with Medical Icons */}
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-secondary to-secondary-600 rounded-3xl flex items-center justify-center mr-5 shadow-xl">
                  <MedicalShieldIcon className="text-white" size="lg" />
                </div>
                <div className="flex-1">
                  <h2 id="description-heading" className="text-3xl font-bold text-gray-800 mb-1" tabIndex={0}>
                    Giới thiệu
                  </h2>
                  <p className="text-secondary font-medium">Thông tin chi tiết về bác sĩ</p>
                </div>
                {/* Heart Icon Decoration */}
                <div className="w-6 h-6 opacity-20">
                  <HeartIcon className="text-secondary" size="md" />
                </div>
              </div>

              {/* Enhanced Medical Divider */}
              <div className="flex items-center mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
                <div className="mx-4 w-4 h-4 opacity-40">
                  <MedicalCrossIcon className="text-secondary" size="sm" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent-300 to-transparent"></div>
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                style={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: normalizeHtml(description) }}
              />
            </section>
          </motion.div>

          {/* Enhanced Booking Button with Modern Medical Design */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative"
            >
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-blue-700 rounded-3xl blur-lg opacity-30 animate-pulse"></div>

              <TransitionLink
                to={`/booking?doctor=${id}`}
                className="relative bg-gradient-to-r from-primary via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white font-bold py-5 px-16 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center space-x-4 text-lg min-h-[64px] border border-white/20 backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <AppointmentIcon className="text-white" size="md" />
                </div>
                <span className="tracking-wide">Đặt lịch khám ngay</span>

                {/* Arrow Icon */}
                <motion.div
                  className="w-6 h-6"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </TransitionLink>

              {/* Enhanced Medical Cross Decoration */}
              <div className="absolute -top-2 -right-2 w-6 h-6 opacity-30">
                <MedicalCrossIcon className="text-white" size="md" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ARIA Live Regions for Screen Readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading && 'Đang tải thông tin bác sĩ...'}
          {error && 'Không thể tải thông tin bác sĩ. Vui lòng thử lại.'}
          {!loading && !error && `Đã tải thông tin bác sĩ ${name}`}
        </div>

        {/* API Debug Component (Development only) */}
        <APIDebug data={doctor} type="doctor" />
      </motion.div>
    </>
  );
}

export default DoctorDetailPage;
