/**
 * Comprehensive Medical App Validator
 * Integrates accessibility, mobile responsiveness, and medical-specific validations
 */

import { accessibilityValidator, MedicalAccessibilityUtils } from './accessibility-validator';
import { mobileResponsivenessValidator, MobileResponsivenessUtils } from './mobile-responsiveness-validator';
import { cacheMonitoring } from './medical-cache';
import { performanceMonitor, MedicalPerformanceUtils } from './performance-monitor';

interface ComprehensiveReport {
  timestamp: number;
  accessibility: {
    score: number;
    issues: number;
    criticalIssues: number;
  };
  mobileResponsiveness: {
    score: number;
    zaloCompatible: boolean;
    medicalOptimized: boolean;
  };
  performance: {
    summary: any;
    medicalContextMetrics: any;
  };
  caching: {
    status: string;
    vietnameseStatus: string;
    issues: string[];
  };
  overallScore: number;
  recommendations: string[];
  vietnameseRecommendations: string[];
}

class MedicalAppValidator {
  /**
   * Run comprehensive validation of the medical app
   */
  async runComprehensiveValidation(): Promise<ComprehensiveReport> {
    console.log('🏥 Bắt đầu kiểm tra toàn diện ứng dụng y tế...');

    // Run all validations
    const accessibilityReport = accessibilityValidator.generateAccessibilityReport();
    const responsivenessReport = mobileResponsivenessValidator.generateResponsivenessReport();
    const performanceSummary = performanceMonitor.getPerformanceSummary();
    const cacheHealth = cacheMonitoring.monitorCacheHealth();

    // Calculate overall score
    const accessibilityWeight = 0.3;
    const responsivenessWeight = 0.3;
    const performanceWeight = 0.2;
    const cachingWeight = 0.2;

    const performanceScore = this.calculatePerformanceScore(performanceSummary);
    const cachingScore = cacheHealth.status === 'healthy' ? 100 : 
                        cacheHealth.status === 'warning' ? 70 : 30;

    const overallScore = Math.round(
      accessibilityReport.score * accessibilityWeight +
      responsivenessReport.overallScore * responsivenessWeight +
      performanceScore * performanceWeight +
      cachingScore * cachingWeight
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      accessibility: accessibilityReport,
      responsiveness: responsivenessReport,
      performance: performanceSummary,
      caching: cacheHealth,
    });

    const report: ComprehensiveReport = {
      timestamp: Date.now(),
      accessibility: {
        score: accessibilityReport.score,
        issues: accessibilityReport.issues.length,
        criticalIssues: accessibilityReport.issues.filter(i => i.severity === 'error').length,
      },
      mobileResponsiveness: {
        score: responsivenessReport.overallScore,
        zaloCompatible: Object.values(responsivenessReport.zaloMiniAppCompatibility).every(Boolean),
        medicalOptimized: Object.values(responsivenessReport.medicalSpecificChecks).every(Boolean),
      },
      performance: {
        summary: performanceSummary,
        medicalContextMetrics: performanceSummary?.medicalContextMetrics || {},
      },
      caching: {
        status: cacheHealth.status,
        vietnameseStatus: cacheHealth.vietnameseStatus,
        issues: cacheHealth.vietnameseIssues,
      },
      overallScore,
      recommendations: recommendations.english,
      vietnameseRecommendations: recommendations.vietnamese,
    };

    return report;
  }

  /**
   * Calculate performance score from performance summary
   */
  private calculatePerformanceScore(summary: any): number {
    if (!summary) return 50;

    let score = 100;

    // Penalize for slow metrics
    if (summary.averageMetrics?.largest_contentful_paint > 2500) score -= 20;
    if (summary.averageMetrics?.first_input_delay > 100) score -= 15;
    if (summary.averageMetrics?.page_load_time > 3000) score -= 15;

    // Bonus for emergency context optimization
    if (summary.medicalContextMetrics?.emergency > 0) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(results: any): { english: string[]; vietnamese: string[] } {
    const english: string[] = [];
    const vietnamese: string[] = [];

    // Accessibility recommendations
    if (results.accessibility.score < 80) {
      english.push('Improve accessibility by adding ARIA labels and ensuring proper keyboard navigation');
      vietnamese.push('Cải thiện khả năng tiếp cận bằng cách thêm nhãn ARIA và đảm bảo điều hướng bàn phím phù hợp');
    }

    if (results.accessibility.criticalIssues > 0) {
      english.push('Fix critical accessibility issues, especially for emergency medical features');
      vietnamese.push('Khắc phục các vấn đề khả năng tiếp cận nghiêm trọng, đặc biệt cho tính năng y tế cấp cứu');
    }

    // Mobile responsiveness recommendations
    if (results.responsiveness.score < 80) {
      english.push('Optimize mobile layout and ensure 44px minimum touch targets');
      vietnamese.push('Tối ưu hóa bố cục mobile và đảm bảo mục tiêu chạm tối thiểu 44px');
    }

    if (!results.responsiveness.zaloCompatible) {
      english.push('Fix Zalo Mini App compatibility issues with safe areas and gesture handling');
      vietnamese.push('Khắc phục vấn đề tương thích Zalo Mini App với vùng an toàn và xử lý cử chỉ');
    }

    // Performance recommendations
    if (results.performance.summary?.averageMetrics?.largest_contentful_paint > 2500) {
      english.push('Optimize images and reduce bundle size to improve loading performance');
      vietnamese.push('Tối ưu hóa hình ảnh và giảm kích thước bundle để cải thiện hiệu suất tải');
    }

    // Caching recommendations
    if (results.caching.status !== 'healthy') {
      english.push('Optimize medical cache configuration and ensure emergency data is properly cached');
      vietnamese.push('Tối ưu hóa cấu hình bộ nhớ đệm y tế và đảm bảo dữ liệu cấp cứu được lưu trữ đúng cách');
    }

    return { english, vietnamese };
  }

  /**
   * Log comprehensive report with Vietnamese localization
   */
  logComprehensiveReport(report: ComprehensiveReport): void {
    console.group('🏥 BÁO CÁO TOÀN DIỆN ỨNG DỤNG Y TẾ');
    console.log(`📊 Điểm số tổng thể: ${report.overallScore}/100`);
    console.log(`⏰ Thời gian kiểm tra: ${new Date(report.timestamp).toLocaleString('vi-VN')}`);
    
    console.group('♿ Khả năng tiếp cận:');
    console.log(`Điểm số: ${report.accessibility.score}/100`);
    console.log(`Tổng vấn đề: ${report.accessibility.issues}`);
    console.log(`Vấn đề nghiêm trọng: ${report.accessibility.criticalIssues}`);
    console.groupEnd();

    console.group('📱 Tương thích thiết bị di động:');
    console.log(`Điểm số: ${report.mobileResponsiveness.score}/100`);
    console.log(`Tương thích Zalo: ${report.mobileResponsiveness.zaloCompatible ? '✅' : '❌'}`);
    console.log(`Tối ưu y tế: ${report.mobileResponsiveness.medicalOptimized ? '✅' : '❌'}`);
    console.groupEnd();

    console.group('⚡ Hiệu suất:');
    console.log('Tóm tắt:', report.performance.summary);
    console.log('Metrics y tế:', report.performance.medicalContextMetrics);
    console.groupEnd();

    console.group('💾 Bộ nhớ đệm:');
    console.log(`Trạng thái: ${report.caching.vietnameseStatus}`);
    if (report.caching.issues.length > 0) {
      console.log('Vấn đề:', report.caching.issues);
    }
    console.groupEnd();

    if (report.vietnameseRecommendations.length > 0) {
      console.group('💡 Khuyến nghị cải thiện:');
      report.vietnameseRecommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      console.groupEnd();
    }

    // Overall assessment
    let assessment = '';
    if (report.overallScore >= 90) {
      assessment = '🌟 Xuất sắc - Ứng dụng y tế đạt tiêu chuẩn cao';
    } else if (report.overallScore >= 80) {
      assessment = '✅ Tốt - Ứng dụng y tế hoạt động ổn định với một số cải thiện nhỏ';
    } else if (report.overallScore >= 70) {
      assessment = '⚠️ Cần cải thiện - Có một số vấn đề cần được khắc phục';
    } else {
      assessment = '🚨 Cần chú ý - Nhiều vấn đề cần được ưu tiên khắc phục';
    }

    console.log(`\n${assessment}`);
    console.groupEnd();
  }

  /**
   * Initialize comprehensive monitoring
   */
  initializeComprehensiveMonitoring(): void {
    // Initialize individual monitoring systems
    MedicalAccessibilityUtils.initializeAccessibilityMonitoring();
    MobileResponsivenessUtils.initializeMobileMonitoring();
    cacheMonitoring.initializeMedicalCacheMonitoring();

    // Run comprehensive validation periodically
    setInterval(async () => {
      const report = await this.runComprehensiveValidation();
      
      // Only log if there are issues
      if (report.overallScore < 85) {
        this.logComprehensiveReport(report);
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    console.log('🏥 Đã khởi tạo giám sát toàn diện ứng dụng y tế');
  }

  /**
   * Quick health check for development
   */
  async quickHealthCheck(): Promise<void> {
    console.log('🔍 Kiểm tra nhanh tình trạng ứng dụng y tế...');
    
    const report = await this.runComprehensiveValidation();
    
    console.log(`📊 Điểm số: ${report.overallScore}/100`);
    
    if (report.accessibility.criticalIssues > 0) {
      console.error(`🚨 ${report.accessibility.criticalIssues} vấn đề khả năng tiếp cận nghiêm trọng`);
    }
    
    if (!report.mobileResponsiveness.zaloCompatible) {
      console.warn('⚠️ Vấn đề tương thích Zalo Mini App');
    }
    
    if (report.caching.status === 'critical') {
      console.error('🚨 Vấn đề nghiêm trọng với bộ nhớ đệm y tế');
    }

    if (report.overallScore >= 85) {
      console.log('✅ Ứng dụng y tế hoạt động tốt');
    } else {
      console.log('⚠️ Cần cải thiện một số vấn đề');
      console.log('Khuyến nghị:', report.vietnameseRecommendations.slice(0, 3));
    }
  }
}

// Export singleton instance
export const medicalAppValidator = new MedicalAppValidator();

// Utility functions for easy integration
export const MedicalAppValidationUtils = {
  // Quick validation for development
  quickCheck: () => medicalAppValidator.quickHealthCheck(),

  // Full comprehensive validation
  fullValidation: () => medicalAppValidator.runComprehensiveValidation(),

  // Initialize all monitoring systems
  initializeMonitoring: () => medicalAppValidator.initializeComprehensiveMonitoring(),

  // Log current status
  logStatus: async () => {
    const report = await medicalAppValidator.runComprehensiveValidation();
    medicalAppValidator.logComprehensiveReport(report);
  },
};

export default medicalAppValidator;
