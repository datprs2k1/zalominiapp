import { motion } from 'framer-motion';

interface TestResultProps {
  testType: string;
  testName: string;
  description: string;
}

export function TestResult({ testType, testName, description }: TestResultProps) {
  const getTestIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('xét nghiệm hình ảnh') || typeLower.includes('x-quang')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
      );
    }
    if (typeLower.includes('máu') || typeLower.includes('sinh hóa')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    if (typeLower.includes('đánh giá') || typeLower.includes('tổng quan')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
  };

  const getTestColor = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('xét nghiệm hình ảnh') || typeLower.includes('x-quang')) {
      return 'blue';
    }
    if (typeLower.includes('máu') || typeLower.includes('sinh hóa')) {
      return 'red';
    }
    if (typeLower.includes('đánh giá') || typeLower.includes('tổng quan')) {
      return 'green';
    }
    return 'purple';
  };

  const testColor = getTestColor(testType);
  const testIcon = getTestIcon(testType);

  return (
    <motion.div
      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${testColor === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
            ${testColor === 'red' ? 'bg-red-100 text-red-600' : ''}
            ${testColor === 'green' ? 'bg-green-100 text-green-600' : ''}
            ${testColor === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
          `}
          >
            {testIcon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{testName}</h4>
            <p
              className={`text-xs font-medium
              ${testColor === 'blue' ? 'text-blue-600' : ''}
              ${testColor === 'red' ? 'text-red-600' : ''}
              ${testColor === 'green' ? 'text-green-600' : ''}
              ${testColor === 'purple' ? 'text-purple-600' : ''}
            `}
            >
              {testType}
            </p>
          </div>
        </div>

        <div
          className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${testColor === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
          ${testColor === 'red' ? 'bg-red-100 text-red-700' : ''}
          ${testColor === 'green' ? 'bg-green-100 text-green-700' : ''}
          ${testColor === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
        `}
        >
          Hoàn thành
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
