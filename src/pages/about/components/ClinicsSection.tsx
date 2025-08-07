import React from 'react';
import { motion } from 'framer-motion';
import ClinicCard from '@/components/ClinicCard';
import { type Clinic } from '@/data/clinics';
import { AnimatedElement } from './index';
import { CONTENT } from '../constants/content';
import { fadeInUp, staggerChildren } from '../constants/animations';
import type { ClinicsSectionProps } from '../types';

/**
 * Enhanced ClinicsSection with improved medical design and animations
 * @param props - ClinicsSectionProps containing clinics array
 */
export const ClinicsSection: React.FC<ClinicsSectionProps> = ({ clinics }) => (
  <section className="py-20 lg:py-28 bg-gradient-to-br from-surface via-secondary/3 to-surface relative overflow-hidden">
    {/* Enhanced medical status indicators */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-accent to-primary shadow-sm"></div>

    {/* Enhanced floating elements with medical theme */}
    <motion.div
      className="absolute -top-20 right-20 w-56 h-56 rounded-full bg-secondary/12 blur-3xl"
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
    <motion.div
      className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-primary/12 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [360, 180, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 4,
      }}
    />
    <motion.div
      className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-accent/10 blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 2,
      }}
    />

    {/* Bottom medical indicator */}
    <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary shadow-sm"></div>

    <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-6xl">
      <div>
        <AnimatedElement className="flex flex-col items-center justify-center mb-12" animation="fadeScale">
          <motion.div
            className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(37, 99, 235, 0.4)',
                '0 0 0 15px rgba(37, 99, 235, 0)',
                '0 0 0 0 rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {CONTENT.sections.general}
          </motion.h2>

          <motion.div
            className="h-1.5 w-20 bg-healing-green rounded-full my-4"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>

          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Khám phá các dịch vụ y tế chuyên nghiệp và toàn diện của chúng tôi
          </motion.p>
        </AnimatedElement>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerChildren}
        >
          {clinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              variants={fadeInUp}
              custom={index}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: 'easeOut',
              }}
              whileHover={{
                scale: 1.01,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <ClinicCard clinic={clinic} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);
