import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DoctorItem from '../doctor';
import { Doctor } from '@/types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock TransitionLink
vi.mock('../../transition-link', () => ({
  default: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock medical design system
vi.mock('@/styles/medical-design-system', () => ({
  combineClasses: (...classes: string[]) => classes.filter(Boolean).join(' '),
  MEDICAL_COLORS: {},
  BORDER_RADIUS: {
    cardLarge: 'rounded-2xl',
    button: 'rounded-lg',
    pill: 'rounded-full',
  },
  SHADOWS: {
    card: 'shadow-md',
  },
  SPACING: {
    gap: { lg: 'gap-6' },
    padding: { cardLarge: 'p-5' },
  },
  ANIMATIONS: {
    normal: 'transition-all duration-300',
  },
  TOUCH_TARGETS: {},
}));

describe('DoctorItem', () => {
  const mockDoctor: Doctor = {
    id: 1,
    name: 'Dr. John Doe',
    title: 'Bác sĩ CKII',
    languages: 'Tiếng Việt, English',
    specialties: 'Tim mạch',
    image: '/test-image.jpg',
    isAvailable: true,
    unit: 'Khoa Tim mạch',
  };

  const mockDoctorWP = {
    id: 2,
    name: 'Dr. Jane Smith',
    bacsi_chucdanh: 'Thạc sĩ Bác sĩ',
    bacsi_donvi: 'Khoa Nhi',
    languages: 'Tiếng Việt',
    specialties: 'Nhi khoa',
    image: '/test-image-2.jpg',
    isAvailable: false,
  };

  it('renders doctor information correctly', () => {
    render(<DoctorItem doctor={mockDoctor} />);
    
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Bác sĩ CKII')).toBeInTheDocument();
    expect(screen.getByText('Khoa Tim mạch')).toBeInTheDocument();
    expect(screen.getByText('Tiếng Việt, English')).toBeInTheDocument();
  });

  it('handles WordPress doctor format', () => {
    render(<DoctorItem doctor={mockDoctorWP} />);
    
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Thạc sĩ Bác sĩ')).toBeInTheDocument();
    expect(screen.getByText('Khoa Nhi')).toBeInTheDocument();
  });

  it('shows availability indicator', () => {
    render(<DoctorItem doctor={mockDoctor} />);
    
    const availabilityIndicator = screen.getByLabelText('Có sẵn');
    expect(availabilityIndicator).toBeInTheDocument();
  });

  it('shows unavailable indicator for unavailable doctors', () => {
    render(<DoctorItem doctor={mockDoctorWP} />);
    
    const unavailabilityIndicator = screen.getByLabelText('Không có sẵn');
    expect(unavailabilityIndicator).toBeInTheDocument();
  });

  it('handles click events when interactive', () => {
    const handleClick = vi.fn();
    render(<DoctorItem doctor={mockDoctor} onClick={handleClick} />);
    
    const doctorCard = screen.getByRole('button');
    fireEvent.click(doctorCard);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<DoctorItem doctor={mockDoctor} onClick={handleClick} />);
    
    const doctorCard = screen.getByRole('button');
    fireEvent.keyDown(doctorCard, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as link when no onClick provided', () => {
    render(<DoctorItem doctor={mockDoctor} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/doctor/1');
  });

  it('displays suffix element when provided', () => {
    const suffix = <span data-testid="suffix">Selected</span>;
    render(<DoctorItem doctor={mockDoctor} suffix={suffix} />);
    
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('handles image loading errors gracefully', () => {
    render(<DoctorItem doctor={mockDoctor} />);
    
    const image = screen.getByAltText('Ảnh đại diện của Dr. John Doe');
    fireEvent.error(image);
    
    // Should fallback to default avatar
    expect(image).toHaveAttribute('src', '/avatar-doctor-fallback.png');
  });

  it('provides proper accessibility attributes', () => {
    const handleClick = vi.fn();
    render(<DoctorItem doctor={mockDoctor} onClick={handleClick} />);
    
    const doctorCard = screen.getByRole('button');
    expect(doctorCard).toHaveAttribute('aria-label');
    expect(doctorCard).toHaveAttribute('tabIndex', '0');
    expect(doctorCard).toHaveAttribute('aria-disabled', 'false');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalDoctor: Doctor = {
      id: 3,
      name: 'Dr. Minimal',
      title: 'Bác sĩ',
      languages: '',
      specialties: '',
      image: '',
      isAvailable: true,
    };

    render(<DoctorItem doctor={minimalDoctor} />);
    
    expect(screen.getByText('Dr. Minimal')).toBeInTheDocument();
    expect(screen.getByText('Bác sĩ')).toBeInTheDocument();
  });

  it('can hide languages when withLanguages is false', () => {
    render(<DoctorItem doctor={mockDoctor} withLanguages={false} />);
    
    expect(screen.queryByText('Tiếng Việt, English')).not.toBeInTheDocument();
  });

  it('renders custom description when provided', () => {
    const description = <div data-testid="custom-description">Custom description</div>;
    render(<DoctorItem doctor={mockDoctor} description={description} />);
    
    expect(screen.getByTestId('custom-description')).toBeInTheDocument();
  });
});
