import { cn } from '@/utils/cn';
import { motion, PanInfo } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  className?: string;
}

interface SlideData {
  id: number;
  image: string;
  alt: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: SlideData[] = [
    {
      id: 1,
      image: 'https://benhvienhoabinh.vn/wp-content/uploads/2025/07/lich-kham-chuyen-gia-thang-7-1-scaled.jpg',
      alt: 'Banner Tâm Thiện Đức 1',
    },
    {
      id: 2,
      image: 'https://benhvienhoabinh.vn/wp-content/uploads/2025/07/lich-kham-chuyen-gia-thang-7-scaled.jpg',
      alt: 'Banner Tâm Thiện Đức 2',
    },
    {
      id: 3,
      image: 'https://benhvienhoabinh.vn/wp-content/uploads/2025/03/banner-chup-cat-lop-vi-tinh.png',
      alt: 'Banner Tâm Thiện Đức 3',
    },
  ];

  // Simple auto-slide functionality
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset timer when user interacts
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  // Handle swipe gestures for mobile
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }
  };

  return (
    <section className={cn('relative', className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Simple Hero Slider */}
        <div className="relative w-full mb-4">
          {/* Slider Container */}
          <div className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-lg select-none">
            {/* Slides with swipe support */}
            <motion.div
              className="relative w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </motion.div>

            {/* Simple Slide Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-0.5">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-1.5 h-0.5 rounded-full transition-all duration-300',
                    index === currentSlide ? 'bg-white/90' : 'bg-white/30'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
