import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <MedicalErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

interface MedicalErrorDisplayProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  showDetails?: boolean;
}

const MedicalErrorDisplay: React.FC<MedicalErrorDisplayProps> = ({
  error,
  errorInfo,
  onRetry,
  showDetails = false,
}) => {
  const [showDetailedError, setShowDetailedError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Lỗi hệ thống</h1>
              <p className="text-red-100 text-sm">Đã xảy ra lỗi không mong muốn</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Có lỗi xảy ra</h3>
            <p className="text-gray-600 text-sm">Chúng tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau ít phút.</p>
          </div>

          {/* Error Actions */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Thử lại
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Về trang chủ
            </button>

            <button
              onClick={() => (window.location.href = '/contact')}
              className="w-full text-blue-600 hover:text-blue-700 py-2 px-4 text-sm font-medium transition-colors"
            >
              Liên hệ hỗ trợ
            </button>
          </div>

          {/* Error Details Toggle */}
          {(showDetails || process.env.NODE_ENV === 'development') && (
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowDetailedError(!showDetailedError)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showDetailedError ? 'Ẩn' : 'Hiện'} chi tiết lỗi
              </button>

              {showDetailedError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 overflow-auto max-h-40"
                >
                  <div className="mb-2">
                    <strong>Error:</strong> {error?.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">{error?.stack}</pre>
                  </div>
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Emergency Contact */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-orange-900 text-sm">Cần hỗ trợ khẩn cấp?</h4>
                <p className="text-xs text-orange-700 mt-1">
                  Gọi hotline: <strong>1900 1234</strong> (24/7)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Network Error Component
interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ onRetry, message = 'Không thể kết nối mạng' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 text-center"
    >
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi kết nối</h3>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-xl font-medium transition-colors"
      >
        Thử lại
      </button>
    </motion.div>
  );
};

// Not Found Error Component
interface NotFoundErrorProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  title = 'Không tìm thấy trang',
  message = 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
  showBackButton = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="space-y-3">
          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Quay lại
            </button>
          )}
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Permission Error Component
interface PermissionErrorProps {
  title?: string;
  message?: string;
  onRequestPermission?: () => void;
}

export const PermissionError: React.FC<PermissionErrorProps> = ({
  title = 'Cần quyền truy cập',
  message = 'Ứng dụng cần quyền truy cập để hoạt động bình thường.',
  onRequestPermission,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-yellow-200 p-6 text-center"
    >
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      {onRequestPermission && (
        <button
          onClick={onRequestPermission}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-xl font-medium transition-colors"
        >
          Cấp quyền
        </button>
      )}
    </motion.div>
  );
};

export default ErrorBoundary;
