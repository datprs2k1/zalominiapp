import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider, ThemeToggle, useTheme } from '@/components/theme-provider';
import {
  PageTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  VitalSign,
  MedicalLabel,
  ResponsiveTitle,
  GradientText,
  TypewriterText,
} from '@/components/typography';
import { Grid, Container, Card, Stack, Section, MedicalCard } from '@/components/enhanced-layout';
import {
  EnhancedLoadingSpinner,
  SkeletonScreen,
  ProgressiveLoading,
  LoadingWave,
} from '@/components/enhanced-loading-states';
import {
  AnimatedContainer,
  StaggeredList,
  AnimatedButton,
  FloatingActionButton,
  AnimatedStatusIndicator,
  AnimatedToast,
  AnimatedProgressBar,
} from '@/components/enhanced-animations';

function UIShowcaseContent() {
  const { isDark, toggleTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(65);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Đang kết nối với hệ thống...',
    'Đang xác thực thông tin...',
    'Đang tải dữ liệu bệnh nhân...',
    'Hoàn tất!',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <Section background="gradient" padding="lg">
        <Stack direction="row" justify="between" align="center" className="mb-8">
          <ResponsiveTitle level="hero">
            <GradientText gradient="from-blue-600 to-green-600">UI/UX Showcase</GradientText>
          </ResponsiveTitle>
          <ThemeToggle />
        </Stack>

        <BodyText size="xl" className="text-center max-w-3xl mx-auto">
          <TypewriterText speed={30}>
            Khám phá hệ thống thiết kế y tế hiện đại với animations mượt mà, responsive design và dark mode support.
          </TypewriterText>
        </BodyText>
      </Section>

      {/* Typography Section */}
      <Section title="Typography System" subtitle="Hệ thống typography được tối ưu cho ứng dụng y tế">
        <Grid cols={2} gap="lg" responsive={{ sm: 1, md: 2 }}>
          <AnimatedContainer animation="fadeInLeft">
            <Card variant="elevated" padding="lg">
              <CardTitle>Headings</CardTitle>
              <Stack spacing="md">
                <PageTitle>Page Title</PageTitle>
                <SectionTitle>Section Title</SectionTitle>
                <CardTitle>Card Title</CardTitle>
              </Stack>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeInRight" delay={0.2}>
            <Card variant="elevated" padding="lg">
              <CardTitle>Medical Typography</CardTitle>
              <Stack spacing="md">
                <VitalSign>120/80 mmHg</VitalSign>
                <MedicalLabel>Huyết áp:</MedicalLabel>
                <BodyText>Thông tin bệnh nhân được hiển thị rõ ràng và dễ đọc.</BodyText>
              </Stack>
            </Card>
          </AnimatedContainer>
        </Grid>
      </Section>

      {/* Loading States Section */}
      <Section
        title="Loading States"
        subtitle="Các trạng thái loading được thiết kế đặc biệt cho ngữ cảnh y tế"
        background="muted"
      >
        <Grid cols={3} gap="lg" responsive={{ sm: 1, md: 2, lg: 3 }}>
          <AnimatedContainer animation="scaleIn">
            <Card variant="elevated" padding="lg" className="text-center">
              <CardTitle>Medical Spinner</CardTitle>
              <EnhancedLoadingSpinner variant="medical" size="lg" />
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="scaleIn" delay={0.1}>
            <Card variant="elevated" padding="lg" className="text-center">
              <CardTitle>Heartbeat</CardTitle>
              <EnhancedLoadingSpinner variant="heartbeat" size="lg" />
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="scaleIn" delay={0.2}>
            <Card variant="elevated" padding="lg" className="text-center">
              <CardTitle>Wave Animation</CardTitle>
              <LoadingWave height={40} />
            </Card>
          </AnimatedContainer>
        </Grid>

        <AnimatedContainer animation="fadeInUp" delay={0.4}>
          <Card variant="elevated" padding="lg" className="mt-8">
            <CardTitle>Progressive Loading</CardTitle>
            <ProgressiveLoading steps={loadingSteps} currentStep={loadingStep} showProgress={true} />
          </Card>
        </AnimatedContainer>
      </Section>

      {/* Animations Section */}
      <Section title="Enhanced Animations" subtitle="Micro-interactions và animations tăng trải nghiệm người dùng">
        <Grid cols={2} gap="lg" responsive={{ sm: 1, md: 2 }}>
          <AnimatedContainer animation="fadeInLeft">
            <Card variant="elevated" padding="lg">
              <CardTitle>Interactive Buttons</CardTitle>
              <Stack spacing="md">
                <AnimatedButton variant="primary">Primary Button</AnimatedButton>
                <AnimatedButton variant="medical">Medical Button</AnimatedButton>
                <AnimatedButton variant="emergency">Emergency Button</AnimatedButton>
              </Stack>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeInRight" delay={0.2}>
            <Card variant="elevated" padding="lg">
              <CardTitle>Status Indicators</CardTitle>
              <Stack spacing="md">
                <Stack direction="row" align="center" spacing="md">
                  <AnimatedStatusIndicator status="normal" />
                  <span>Normal</span>
                </Stack>
                <Stack direction="row" align="center" spacing="md">
                  <AnimatedStatusIndicator status="warning" />
                  <span>Warning</span>
                </Stack>
                <Stack direction="row" align="center" spacing="md">
                  <AnimatedStatusIndicator status="critical" />
                  <span>Critical</span>
                </Stack>
                <Stack direction="row" align="center" spacing="md">
                  <AnimatedStatusIndicator status="emergency" />
                  <span>Emergency</span>
                </Stack>
              </Stack>
            </Card>
          </AnimatedContainer>
        </Grid>

        <AnimatedContainer animation="fadeInUp" delay={0.4}>
          <Card variant="elevated" padding="lg" className="mt-8">
            <CardTitle>Progress Indicators</CardTitle>
            <Stack spacing="lg">
              <AnimatedProgressBar progress={progress} label="Treatment Progress" color="#10B981" />
              <Stack direction="row" spacing="md">
                <AnimatedButton variant="secondary" onClick={() => setProgress(Math.max(0, progress - 10))}>
                  Decrease
                </AnimatedButton>
                <AnimatedButton variant="primary" onClick={() => setProgress(Math.min(100, progress + 10))}>
                  Increase
                </AnimatedButton>
              </Stack>
            </Stack>
          </Card>
        </AnimatedContainer>
      </Section>

      {/* Medical Cards Section */}
      <Section
        title="Medical Components"
        subtitle="Components được thiết kế đặc biệt cho ứng dụng y tế"
        background="muted"
      >
        <StaggeredList staggerDelay={0.1}>
          <MedicalCard
            status="normal"
            title="Khám tổng quát"
            subtitle="Bác sĩ Nguyễn Văn A"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            hoverable
            animated
          >
            <BodyText>Lịch khám: 14:30 - 15:00, 25/07/2024</BodyText>
          </MedicalCard>

          <MedicalCard
            status="warning"
            title="Tái khám"
            subtitle="Bác sĩ Trần Thị B"
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            }
            hoverable
            animated
          >
            <BodyText>Cần mang theo kết quả xét nghiệm</BodyText>
          </MedicalCard>

          <MedicalCard
            status="critical"
            title="Cấp cứu"
            subtitle="Khoa Cấp cứu"
            icon={
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            }
            hoverable
            animated
          >
            <BodyText>Liên hệ ngay: 1900-1234</BodyText>
          </MedicalCard>
        </StaggeredList>
      </Section>

      {/* Skeleton Loading Section */}
      <Section title="Skeleton Screens" subtitle="Loading states với skeleton screens">
        <Grid cols={2} gap="lg" responsive={{ sm: 1, md: 2 }}>
          <AnimatedContainer animation="fadeInLeft">
            <Card variant="elevated" padding="lg">
              <CardTitle>Card Skeleton</CardTitle>
              <SkeletonScreen variant="card" />
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeInRight" delay={0.2}>
            <Card variant="elevated" padding="lg">
              <CardTitle>List Skeleton</CardTitle>
              <SkeletonScreen variant="list" lines={3} />
            </Card>
          </AnimatedContainer>
        </Grid>
      </Section>

      {/* Toast Demo */}
      <Section title="Notifications" subtitle="Toast notifications với animations">
        <AnimatedContainer animation="fadeInUp">
          <Card variant="elevated" padding="lg" className="text-center">
            <CardTitle>Toast Demo</CardTitle>
            <Stack direction="row" justify="center" spacing="md">
              <AnimatedButton variant="primary" onClick={() => setShowToast(true)}>
                Show Toast
              </AnimatedButton>
            </Stack>
          </Card>
        </AnimatedContainer>
      </Section>

      {/* Floating Action Button */}
      <FloatingActionButton variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </FloatingActionButton>

      {/* Toast */}
      <AnimatedToast type="success" isVisible={showToast} onClose={() => setShowToast(false)}>
        🎉 UI Showcase đã được tải thành công!
      </AnimatedToast>
    </div>
  );
}

export default function UIShowcasePage() {
  return (
    <ThemeProvider>
      <UIShowcaseContent />
    </ThemeProvider>
  );
}
