import ArrowRightIcon from '@/components/icons/arrow-right';
import { doctorsState, userState } from '@/state';
import { useAtomValue } from 'jotai';
import { motion, useReducedMotion } from 'framer-motion';
import prescription from '@/static/services/prescription.svg';
import calendar from '@/static/services/calendar.svg';
import clipboard from '@/static/services/clipboard.svg';
import heart from '@/static/services/heart.svg';
import Section from '@/components/section';
import { Action } from './action';
import { VisitedDoctor } from './visited-doctor';
import UserProfile from '@/components/user-profile';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import {
  MEDICAL_COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
  ACCESSIBILITY,
  SPACING,
  combineClasses,
} from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

function ProfilePage() {
  const [d1, d2] = useAtomValue(doctorsState);
  const userPromise = useAtomValue(userState);
  const prefersReducedMotion = useReducedMotion();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userPromise;
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userPromise]);

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-green-50/30"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? {}
          : {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {/* Enhanced Medical Profile Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }
        }
      >
        <div className="flex items-center space-x-4 mb-6">
          {loading ? (
            <>
              <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <img
                  src={user?.userInfo.avatar || '/default-avatar.png'}
                  alt={user?.userInfo.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-1">{user?.userInfo.name || 'Bệnh nhân'}</h1>
                <p className="text-blue-100 text-sm">Thành viên từ tháng 1, 2024</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Tài khoản đã xác thực</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Health Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-xs text-blue-100">Lịch hẹn sắp tới</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1">15</div>
            <div className="text-xs text-blue-100">Hồ sơ y tế</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-green-300">Tốt</div>
            <div className="text-xs text-blue-100">Tình trạng sức khỏe</div>
          </div>
        </div>
      </motion.div>
      {/* Quick Actions Grid */}
      <motion.div
        className="px-6 py-6"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.5,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }
        }
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: calendar,
              label: 'Đặt lịch khám',
              subtitle: 'Đặt lịch mới',
              color: getColorToken('primary'),
              to: '/booking',
            },
            {
              icon: clipboard,
              label: 'Lịch sử khám',
              subtitle: 'Xem hồ sơ',
              color: getColorToken('secondary'),
              to: '/schedule',
            },
            {
              icon: prescription,
              label: 'Hóa đơn',
              subtitle: 'Thanh toán',
              color: getColorToken('accent'),
              to: '/invoices',
            },
            {
              icon: heart,
              label: 'Phản hồi',
              subtitle: 'Đánh giá dịch vụ',
              color: '#EF4444',
              to: '/feedback',
            },
          ].map(({ icon, label, subtitle, color, to }, index) => (
            <motion.a
              key={label}
              href={to}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 medical-focus"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 0.3,
                      delay: 0.3 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <img src={icon} className="w-6 h-6" alt={label} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{label}</div>
                <div className="text-xs text-gray-500">{subtitle}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
      {/* Enhanced Medical Dashboard Content */}
      <motion.div
        className="flex-1 flex flex-col bg-white py-6 space-y-6 overflow-y-auto"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.6,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }
        }
      >
        <Section title="Medical Services" viewMore="/services">
          <motion.div
            className="grid grid-cols-4 pt-6 gap-4 text-center text-xs"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {[
              { icon: prescription, label: 'Prescriptions', color: MEDICAL_COLORS.secondary.green },
              { icon: calendar, label: 'Appointments', color: MEDICAL_COLORS.primary.blue },
              { icon: clipboard, label: 'Medical History', color: MEDICAL_COLORS.accent.cyan },
              { icon: heart, label: 'Family Care', color: '#EF4444' },
            ].map(({ icon, label, color }, index) => (
              <motion.div
                key={label}
                className="flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: `${color}08`,
                  border: `1px solid ${color}15`,
                }}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 0.4,
                        delay: 0.5 + index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.05,
                        backgroundColor: `${color}12`,
                      }
                }
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <img src={icon} className="h-6 w-6" />
                </div>
                <div className="text-center font-medium" style={{ color: color }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>
        <Section title="Bác sĩ đã khám gần đây">
          <motion.div
            className="pt-4 space-y-3"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 0.5,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            <div className="grid grid-cols-1 gap-3">
              <motion.div
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <img src={d1.image} className="w-12 h-12 rounded-full object-cover" alt={d1.name} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{d1.name}</div>
                  <div className="text-sm text-blue-600">{d1.specialties}</div>
                  <div className="text-xs text-gray-500 mt-1">Khám gần nhất: 15/01/2024</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Có lịch</span>
                  </div>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                    Đặt lại
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <img src={d2.image} className="w-12 h-12 rounded-full object-cover" alt={d2.name} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{d2.name}</div>
                  <div className="text-sm text-green-600">{d2.specialties}</div>
                  <div className="text-xs text-gray-500 mt-1">Khám gần nhất: 10/01/2024</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Có lịch</span>
                  </div>
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors">
                    Đặt lại
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Section>

        <Section title="Tài khoản y tế">
          <motion.div
            className="pt-4 space-y-3"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 0.5,
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
            >
              <Action
                label="Hóa đơn y tế"
                badge={3}
                icon={<ArrowRightIcon className="h-4 w-4 text-blue-600" />}
                to="/invoices"
              />
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
            >
              <Action
                label="Phản hồi dịch vụ"
                icon={<ArrowRightIcon className="h-4 w-4 text-green-600" />}
                to="/feedback"
              />
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
            >
              <Action
                label="Thông tin bệnh viện"
                icon={<ArrowRightIcon className="h-4 w-4 text-purple-600" />}
                to="/about"
              />
            </motion.div>

            {/* Emergency Contact Card */}
            <motion.div
              className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 mt-6"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-red-900">Cấp cứu 24/7</div>
                    <div className="text-sm text-red-700">Luôn sẵn sàng hỗ trợ</div>
                  </div>
                </div>
                <a
                  href="tel:115"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors medical-focus"
                >
                  Gọi 115
                </a>
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;
