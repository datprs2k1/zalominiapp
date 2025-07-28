/**
 * Enhanced Performance Monitor Component
 * Displays API performance metrics for debugging and optimization
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-29
 */

import React, { useState, useEffect } from 'react';
import { getCacheStats } from '@/services/cache';
import { getAPIMetrics, clearAPIMetrics, reportAPIPerformanceIssues } from '@/utils/api-performance-monitor';

const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      try {
        const apiMetrics = getAPIMetrics();
        const cache = getCacheStats();
        const performanceIssues = reportAPIPerformanceIssues();

        setMetrics(apiMetrics);
        setCacheStats(cache);
        setIssues(performanceIssues);
      } catch (error) {
        console.error('Error updating performance metrics:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClearMetrics = () => {
    clearAPIMetrics();
    setMetrics(getAPIMetrics());
    setIssues([]);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-50"
        style={{ fontSize: '12px' }}
      >
        📊 Performance{issues.length > 0 && ` (${issues.length})`}
      </button>
    );
  }

  const avgResponseTime = metrics?.averageResponseTime?.toFixed(0) || '0';
  const hitRate = cacheStats?.hitRate ? (cacheStats.hitRate * 100).toFixed(1) : '0';
  const totalRequests = metrics?.totalRequests || 0;
  const slowRequests = metrics?.slowRequests || 0;
  const criticalRequests = metrics?.criticalRequests || 0;
  const totalEntries = cacheStats?.totalEntries || 0;
  const memoryUsage = (cacheStats?.totalSize / (1024 * 1024)).toFixed(1) || '0';

  // Find slow endpoints
  const slowEndpoints = metrics?.endpointPerformance
    ? Object.entries(metrics.endpointPerformance)
        .filter(([_, data]) => (data as any).averageTime > 800 && (data as any).count > 2)
        .sort(([_, a], [__, b]) => (b as any).averageTime - (a as any).averageTime)
        .slice(0, 3)
    : [];

  // Find large responses
  const largeResponses = metrics?.largestResponses || [];

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-[400px] overflow-auto z-50 text-xs w-[320px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">API Performance</h3>
        <div className="space-x-2">
          <button onClick={handleClearMetrics} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs">
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
          >
            Close
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mb-3 bg-red-50 p-2 rounded border border-red-200">
          <p className="font-semibold text-red-700">Issues Detected:</p>
          <ul className="text-xs text-red-600 ml-2">
            {issues.map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-xs text-gray-600">Avg Response</div>
          <div className="text-sm font-bold">
            {avgResponseTime}ms
            {slowRequests > 0 && <span className="ml-1 text-xs font-normal text-red-500">({slowRequests} slow)</span>}
          </div>
        </div>
        <div className="p-2 bg-green-50 rounded">
          <div className="text-xs text-gray-600">Cache Hit Rate</div>
          <div className="text-sm font-bold">
            {hitRate}%<span className="ml-1 text-xs font-normal text-gray-500">({totalEntries} items)</span>
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-600">Requests</div>
          <div className="text-sm font-bold">
            {totalRequests}
            {criticalRequests > 0 && (
              <span className="ml-1 text-xs font-normal text-red-600">({criticalRequests} critical)</span>
            )}
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-600">Cache Size</div>
          <div className="text-sm font-bold">{memoryUsage} MB</div>
        </div>
      </div>

      {slowEndpoints.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold text-gray-700 mb-1">Slow Endpoints:</p>
          <div className="text-xs max-h-20 overflow-auto">
            {slowEndpoints.map(([endpoint, data]: [string, any], i) => (
              <div key={i} className="flex justify-between py-1 border-t border-gray-100">
                <span className="truncate max-w-[160px]">{endpoint}</span>
                <span className={data.averageTime > 1000 ? 'text-red-500' : 'text-orange-500'}>
                  {data.averageTime.toFixed(0)}ms ({data.count} calls)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {largeResponses.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">Largest Responses:</p>
          <div className="text-xs max-h-20 overflow-auto">
            {largeResponses.map((resp: any, i) => (
              <div key={i} className="flex justify-between py-1 border-t border-gray-100">
                <span className="truncate max-w-[160px]">{resp.url.split('?')[0]}</span>
                <span className="text-gray-700">{(resp.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
