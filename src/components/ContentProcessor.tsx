import React, { useState } from 'react';
import { HtmlContentDisplay } from './HtmlContentDisplay';
import { extractRawHtml, addTailwindStructure } from '../utils/htmlProcessingHelpers';
import { normalizeHtml } from '../utils/normalHTML';

/**
 * Component for processing HTML content from WordPress or other sources
 * and displaying it with Tailwind CSS formatting
 */
export const ContentProcessor: React.FC = () => {
  const [inputHtml, setInputHtml] = useState<string>('');
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<'raw' | 'extracted' | 'structured' | 'normalized'>('raw');

  const handleProcessClick = () => {
    if (!inputHtml.trim()) return;

    // First extract the raw HTML to remove scripts and excess WordPress markup
    const extractedHtml = extractRawHtml(inputHtml);

    // Then add Tailwind structure to responsive elements
    const structuredHtml = addTailwindStructure(extractedHtml);

    // Finally apply full normalization with Tailwind classes
    const normalizedHtml = normalizeHtml(structuredHtml);

    setProcessedHtml(normalizedHtml);
    setIsProcessed(true);
    setProcessingStep('normalized');
  };

  const handleReset = () => {
    setInputHtml('');
    setProcessedHtml('');
    setIsProcessed(false);
    setProcessingStep('raw');
  };

  const showStep = (step: 'raw' | 'extracted' | 'structured' | 'normalized') => {
    if (step === 'raw') {
      setProcessingStep('raw');
      return;
    }

    let html = inputHtml;

    if (step === 'extracted' || step === 'structured' || step === 'normalized') {
      html = extractRawHtml(inputHtml);
    }

    if (step === 'structured' || step === 'normalized') {
      html = addTailwindStructure(html);
    }

    if (step === 'normalized') {
      html = normalizeHtml(html);
    }

    setProcessedHtml(html);
    setProcessingStep(step);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">HTML Content Processor</h1>

      <div className="mb-8">
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Hướng dẫn:</h2>
          <ol className="list-decimal pl-6 text-blue-700">
            <li className="mb-1">Dán nội dung HTML từ WordPress hoặc nguồn khác vào ô bên dưới</li>
            <li className="mb-1">Nhấn "Xử lý nội dung" để chuyển đổi sang định dạng Tailwind CSS</li>
            <li className="mb-1">Xem kết quả hiển thị với các lớp CSS của Tailwind</li>
            <li className="mb-1">Bạn có thể xem từng bước trong quá trình xử lý</li>
          </ol>
        </div>

        {!isProcessed ? (
          <div>
            <textarea
              className="w-full h-80 p-4 border border-gray-300 rounded-md mb-4 font-mono text-sm"
              placeholder="Dán mã HTML của bạn vào đây..."
              value={inputHtml}
              onChange={(e) => setInputHtml(e.target.value)}
            />

            <div className="flex justify-center">
              <button
                onClick={handleProcessClick}
                disabled={!inputHtml.trim()}
                className={`px-6 py-2 rounded-md ${
                  inputHtml.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Xử lý nội dung
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex mb-2 border-b">
                <button
                  onClick={() => showStep('raw')}
                  className={`px-4 py-2 ${processingStep === 'raw' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
                >
                  1. HTML gốc
                </button>
                <button
                  onClick={() => showStep('extracted')}
                  className={`px-4 py-2 ${processingStep === 'extracted' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
                >
                  2. HTML được làm sạch
                </button>
                <button
                  onClick={() => showStep('structured')}
                  className={`px-4 py-2 ${processingStep === 'structured' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
                >
                  3. Cấu trúc Tailwind
                </button>
                <button
                  onClick={() => showStep('normalized')}
                  className={`px-4 py-2 ${processingStep === 'normalized' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
                >
                  4. Kết quả cuối cùng
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md mb-4">
              <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
                <h3 className="font-medium">
                  {processingStep === 'raw' && 'HTML Gốc'}
                  {processingStep === 'extracted' && 'HTML đã được làm sạch (scripts và styles đã được loại bỏ)'}
                  {processingStep === 'structured' && 'HTML với cấu trúc Tailwind được thêm vào'}
                  {processingStep === 'normalized' && 'Kết quả cuối cùng với các lớp Tailwind CSS'}
                </h3>
              </div>

              <div className="p-4 bg-white">
                {processingStep === 'raw' ? (
                  <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                    {inputHtml}
                  </pre>
                ) : (
                  <div>
                    <HtmlContentDisplay htmlContent={processedHtml} />
                    <div className="mt-4 pt-4 border-t">
                      <details>
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          Xem mã HTML đã được xử lý
                        </summary>
                        <pre className="whitespace-pre-wrap bg-gray-50 p-3 mt-2 rounded text-xs overflow-auto max-h-96">
                          {processedHtml}
                        </pre>
                      </details>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={handleReset} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Xử lý nội dung khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentProcessor;
