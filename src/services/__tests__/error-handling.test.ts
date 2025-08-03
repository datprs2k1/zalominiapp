/**
 * Error Handling Tests
 * Comprehensive tests for enhanced error handling system
 *
 * @version 1.0.0
 * @author Zalo Healthcare Development Team
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  EnhancedMedicalAPIError,
  ErrorFactory,
  ErrorCategory,
  ErrorSeverity,
  ErrorRecovery,
  ErrorLogger,
} from "../base/error-handling";

describe("Enhanced Medical API Error", () => {
  beforeEach(() => {
    ErrorLogger.clearLogs();
  });

  describe("EnhancedMedicalAPIError", () => {
    it("should create error with all properties", () => {
      const context = { endpoint: "/api/test", userId: "123" };
      const error = new EnhancedMedicalAPIError(
        "TEST_ERROR",
        "Test error message",
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        context,
        {
          userMessage: "Custom user message",
          recoverable: true,
          retryable: false,
        },
      );

      expect(error.code).toBe("TEST_ERROR");
      expect(error.message).toBe("Test error message");
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.userMessage).toBe("Custom user message");
      expect(error.recoverable).toBe(true);
      expect(error.retryable).toBe(false);
      expect(error.context.endpoint).toBe("/api/test");
      expect(error.context.userId).toBe("123");
    });

    it("should generate default user message based on category", () => {
      const networkError = new EnhancedMedicalAPIError(
        "NETWORK_ERROR",
        "Network failed",
        ErrorCategory.NETWORK,
      );

      expect(networkError.userMessage).toContain("kết nối mạng");

      const validationError = new EnhancedMedicalAPIError(
        "VALIDATION_ERROR",
        "Invalid data",
        ErrorCategory.VALIDATION,
      );

      expect(validationError.userMessage).toContain("không hợp lệ");
    });

    it("should determine retryable status based on category", () => {
      const networkError = new EnhancedMedicalAPIError(
        "NETWORK_ERROR",
        "Network failed",
        ErrorCategory.NETWORK,
      );
      expect(networkError.retryable).toBe(true);

      const validationError = new EnhancedMedicalAPIError(
        "VALIDATION_ERROR",
        "Invalid data",
        ErrorCategory.VALIDATION,
      );
      expect(validationError.retryable).toBe(false);
    });

    it("should serialize to JSON correctly", () => {
      const originalError = new Error("Original error");
      const error = new EnhancedMedicalAPIError(
        "TEST_ERROR",
        "Test message",
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        { endpoint: "/api/test" },
        { originalError },
      );

      const json = error.toJSON();

      expect(json.name).toBe("EnhancedMedicalAPIError");
      expect(json.code).toBe("TEST_ERROR");
      expect(json.category).toBe(ErrorCategory.NETWORK);
      expect(json.severity).toBe(ErrorSeverity.HIGH);
      expect(json.originalError).toEqual({
        name: "Error",
        message: "Original error",
        stack: originalError.stack,
      });
    });
  });

  describe("ErrorFactory", () => {
    it("should create network error", () => {
      const originalError = new Error("Connection failed");
      const error = ErrorFactory.createNetworkError(
        "Network connection failed",
        { endpoint: "/api/test" },
        originalError,
      );

      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.retryable).toBe(true);
      expect(error.originalError).toBe(originalError);
    });

    it("should create validation error", () => {
      const error = ErrorFactory.createValidationError("Invalid input data", {
        userId: "123",
      });

      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.retryable).toBe(false);
    });

    it("should create timeout error", () => {
      const error = ErrorFactory.createTimeoutError("/api/doctors", 5000, {
        requestId: "req-123",
      });

      expect(error.code).toBe("TIMEOUT_ERROR");
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.retryable).toBe(true);
      expect(error.context.endpoint).toBe("/api/doctors");
    });

    it("should create error from HTTP status", () => {
      const error404 = ErrorFactory.createFromHttpStatus(404, "Not found", {
        endpoint: "/api/doctors/999",
      });

      expect(error404.code).toBe("HTTP_404");
      expect(error404.category).toBe(ErrorCategory.DATA_PROCESSING);
      expect(error404.retryable).toBe(false);

      const error500 = ErrorFactory.createFromHttpStatus(
        500,
        "Internal server error",
      );

      expect(error500.code).toBe("HTTP_500");
      expect(error500.category).toBe(ErrorCategory.DATA_PROCESSING);
      expect(error500.retryable).toBe(true);
    });
  });

  describe("ErrorRecovery", () => {
    it("should attempt recovery for recoverable errors", async () => {
      const retryFunction = jest
        .fn()
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockResolvedValueOnce("Success");

      const recoverableError = new EnhancedMedicalAPIError(
        "NETWORK_ERROR",
        "Network failed",
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        {},
        { recoverable: true, retryable: true },
      );

      const result = await ErrorRecovery.attemptRecovery(
        recoverableError,
        retryFunction,
        2,
      );

      expect(result).toBe("Success");
      expect(retryFunction).toHaveBeenCalledTimes(2);
    });

    it("should not attempt recovery for non-recoverable errors", async () => {
      const retryFunction = jest.fn();
      const nonRecoverableError = new EnhancedMedicalAPIError(
        "VALIDATION_ERROR",
        "Invalid data",
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        {},
        { recoverable: false, retryable: false },
      );

      await expect(
        ErrorRecovery.attemptRecovery(nonRecoverableError, retryFunction, 3),
      ).rejects.toBe(nonRecoverableError);

      expect(retryFunction).not.toHaveBeenCalled();
    });

    it("should provide fallback data for low severity errors", () => {
      const lowSeverityError = new EnhancedMedicalAPIError(
        "CACHE_ERROR",
        "Cache miss",
        ErrorCategory.CACHE,
        ErrorSeverity.LOW,
      );

      const fallbackData = { id: 1, name: "Fallback" };
      const result = ErrorRecovery.getFallbackData(
        lowSeverityError,
        fallbackData,
      );

      expect(result).toBe(fallbackData);
    });

    it("should not provide fallback data for high severity errors", () => {
      const highSeverityError = new EnhancedMedicalAPIError(
        "NETWORK_ERROR",
        "Network failed",
        ErrorCategory.NETWORK,
        ErrorSeverity.CRITICAL,
      );

      const fallbackData = { id: 1, name: "Fallback" };
      const result = ErrorRecovery.getFallbackData(
        highSeverityError,
        fallbackData,
      );

      expect(result).toBeNull();
    });
  });

  describe("ErrorLogger", () => {
    it("should log errors and maintain history", () => {
      const error1 = ErrorFactory.createNetworkError("Network error 1");
      const error2 = ErrorFactory.createValidationError("Validation error 1");

      ErrorLogger.log(error1);
      ErrorLogger.log(error2);

      const recentLogs = ErrorLogger.getRecentLogs(10);
      expect(recentLogs).toHaveLength(2);
      expect(recentLogs[0]).toBe(error2); // Most recent first
      expect(recentLogs[1]).toBe(error1);
    });

    it("should filter logs by category", () => {
      const networkError = ErrorFactory.createNetworkError("Network error");
      const validationError =
        ErrorFactory.createValidationError("Validation error");

      ErrorLogger.log(networkError);
      ErrorLogger.log(validationError);

      const networkLogs = ErrorLogger.getLogsByCategory(ErrorCategory.NETWORK);
      expect(networkLogs).toHaveLength(1);
      expect(networkLogs[0]).toBe(networkError);

      const validationLogs = ErrorLogger.getLogsByCategory(
        ErrorCategory.VALIDATION,
      );
      expect(validationLogs).toHaveLength(1);
      expect(validationLogs[0]).toBe(validationError);
    });

    it("should filter logs by severity", () => {
      const highSeverityError = new EnhancedMedicalAPIError(
        "CRITICAL_ERROR",
        "Critical error",
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
      );

      const lowSeverityError = new EnhancedMedicalAPIError(
        "MINOR_ERROR",
        "Minor error",
        ErrorCategory.CACHE,
        ErrorSeverity.LOW,
      );

      ErrorLogger.log(highSeverityError);
      ErrorLogger.log(lowSeverityError);

      const highSeverityLogs = ErrorLogger.getLogsBySeverity(
        ErrorSeverity.HIGH,
      );
      expect(highSeverityLogs).toHaveLength(1);
      expect(highSeverityLogs[0]).toBe(highSeverityError);

      const lowSeverityLogs = ErrorLogger.getLogsBySeverity(ErrorSeverity.LOW);
      expect(lowSeverityLogs).toHaveLength(1);
      expect(lowSeverityLogs[0]).toBe(lowSeverityError);
    });

    it("should limit log history", () => {
      // Create more than the maximum number of logs
      for (let i = 0; i < 1100; i++) {
        const error = ErrorFactory.createNetworkError(`Error ${i}`);
        ErrorLogger.log(error);
      }

      const recentLogs = ErrorLogger.getRecentLogs(2000);
      expect(recentLogs.length).toBeLessThanOrEqual(1000); // Should be limited to maxLogs
    });

    it("should clear logs", () => {
      const error = ErrorFactory.createNetworkError("Test error");
      ErrorLogger.log(error);

      expect(ErrorLogger.getRecentLogs(10)).toHaveLength(1);

      ErrorLogger.clearLogs();

      expect(ErrorLogger.getRecentLogs(10)).toHaveLength(0);
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete error lifecycle", async () => {
      // Create an error
      const originalError = new Error("Original network failure");
      const error = ErrorFactory.createNetworkError(
        "Failed to fetch doctors",
        { endpoint: "/api/doctors", userId: "123" },
        originalError,
      );

      // Log the error
      ErrorLogger.log(error);

      // Attempt recovery
      let attemptCount = 0;
      const retryFunction = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error(`Attempt ${attemptCount} failed`);
        }
        return Promise.resolve("Recovery successful");
      });

      const result = await ErrorRecovery.attemptRecovery(
        error,
        retryFunction,
        3,
      );

      expect(result).toBe("Recovery successful");
      expect(retryFunction).toHaveBeenCalledTimes(3);

      // Verify error was logged
      const networkLogs = ErrorLogger.getLogsByCategory(ErrorCategory.NETWORK);
      expect(networkLogs).toHaveLength(1);
      expect(networkLogs[0].code).toBe("NETWORK_ERROR");
    });
  });
});
