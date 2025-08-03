/**
 * Validation Tests
 * Comprehensive tests for validation utilities and medical content validation
 *
 * @version 1.0.0
 * @author Zalo Healthcare Development Team
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  BaseValidator,
  WordPressValidator,
  MedicalContentValidator,
  DoctorValidator,
  ServiceValidator,
  ValidationUtils,
  ValidationRule,
} from "../base/validation";
import { WPPost, WPDoctor } from "../wp-types";

describe("Validation System", () => {
  describe("BaseValidator", () => {
    class TestValidator extends BaseValidator<any> {
      constructor() {
        super();
        this.addRule({
          name: "hasId",
          validate: (data) => data && typeof data.id === "number",
          errorMessage: "Must have numeric ID",
        });
      }
    }

    it("should validate data against rules", () => {
      const validator = new TestValidator();

      const validData = { id: 123, name: "Test" };
      const result = validator.validate(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should collect validation errors", () => {
      const validator = new TestValidator();

      const invalidData = { name: "Test" }; // Missing ID
      const result = validator.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Must have numeric ID");
    });

    it("should handle warnings", () => {
      const validator = new TestValidator();
      validator.addRule({
        name: "hasName",
        validate: (data) => data && data.name && data.name.length > 0,
        errorMessage: "Should have a name",
        warningMessage: "Consider adding a name for better identification",
        isWarning: true,
      });

      const dataWithoutName = { id: 123 };
      const result = validator.validate(dataWithoutName);

      expect(result.isValid).toBe(true); // Warnings don't make validation fail
      expect(result.warnings).toContain(
        "Consider adding a name for better identification",
      );
    });

    it("should handle rule execution errors", () => {
      const validator = new TestValidator();
      validator.addRule({
        name: "throwingRule",
        validate: () => {
          throw new Error("Rule execution failed");
        },
        errorMessage: "This rule failed",
      });

      const result = validator.validate({ id: 123 });

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.includes("Rule execution failed")),
      ).toBe(true);
    });
  });

  describe("WordPressValidator", () => {
    let validator: WordPressValidator;

    beforeEach(() => {
      validator = new WordPressValidator();
    });

    it("should validate valid WordPress content", () => {
      const validContent = {
        id: 123,
        title: { rendered: "Test Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
      };

      const result = validator.validate(validContent);
      expect(result.isValid).toBe(true);
    });

    it("should reject content without ID", () => {
      const invalidContent = {
        title: { rendered: "Test Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
      };

      const result = validator.validate(invalidContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Content must have a valid ID");
    });

    it("should reject content without title", () => {
      const invalidContent = {
        id: 123,
        status: "publish",
        date: "2024-01-01T00:00:00Z",
      };

      const result = validator.validate(invalidContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Content must have a non-empty title");
    });

    it("should reject unpublished content", () => {
      const draftContent = {
        id: 123,
        title: { rendered: "Test Title" },
        status: "draft",
        date: "2024-01-01T00:00:00Z",
      };

      const result = validator.validate(draftContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Content must be published");
    });

    it("should reject content with invalid date", () => {
      const invalidDateContent = {
        id: 123,
        title: { rendered: "Test Title" },
        status: "publish",
        date: "invalid-date",
      };

      const result = validator.validate(invalidDateContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Content must have a valid date");
    });
  });

  describe("MedicalContentValidator", () => {
    let validator: MedicalContentValidator;

    beforeEach(() => {
      validator = new MedicalContentValidator();
    });

    it("should validate medical content with all required fields", () => {
      const validMedicalContent = {
        id: 123,
        title: { rendered: "Medical Article Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered:
            "This is a comprehensive medical article with detailed information about healthcare procedures and treatments.",
        },
        excerpt: { rendered: "Brief summary of the medical article" },
      };

      const result = validator.validate(validMedicalContent);
      expect(result.isValid).toBe(true);
    });

    it("should require content for medical articles", () => {
      const contentWithoutBody = {
        id: 123,
        title: { rendered: "Medical Article Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
      };

      const result = validator.validate(contentWithoutBody);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Medical content must have non-empty content",
      );
    });

    it("should warn about short content", () => {
      const shortContent = {
        id: 123,
        title: { rendered: "Medical Article Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: { rendered: "Short content" }, // Less than 50 characters
      };

      const result = validator.validate(shortContent);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Medical content is quite short, consider adding more details",
      );
    });
  });

  describe("DoctorValidator", () => {
    let validator: DoctorValidator;

    beforeEach(() => {
      validator = new DoctorValidator();
    });

    it("should validate complete doctor profile", () => {
      const validDoctor: Partial<WPDoctor> = {
        id: 123,
        title: { rendered: "Dr. Nguyen Van A" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered:
            "Bác sĩ chuyên khoa tim mạch với 10 năm kinh nghiệm. Tốt nghiệp Đại học Y Hà Nội.",
        },
        bacsi_phone: "0123456789",
        featured_media: 456,
      };

      const result = validator.validate(validDoctor);
      expect(result.isValid).toBe(true);
    });

    it("should warn about missing specialization", () => {
      const doctorWithoutSpecialization: Partial<WPDoctor> = {
        id: 123,
        title: { rendered: "Dr. Nguyen Van A" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered: "Bác sĩ với nhiều năm kinh nghiệm trong lĩnh vực y tế.",
        },
        bacsi_phone: "0123456789",
      };

      const result = validator.validate(doctorWithoutSpecialization);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Consider adding clear specialization information",
      );
    });

    it("should warn about missing contact information", () => {
      const doctorWithoutContact: Partial<WPDoctor> = {
        id: 123,
        title: { rendered: "Dr. Nguyen Van A" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered: "Bác sĩ chuyên khoa tim mạch với 10 năm kinh nghiệm.",
        },
      };

      const result = validator.validate(doctorWithoutContact);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Consider adding phone or email contact information",
      );
    });

    it("should warn about missing profile photo", () => {
      const doctorWithoutPhoto: Partial<WPDoctor> = {
        id: 123,
        title: { rendered: "Dr. Nguyen Van A" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered: "Bác sĩ chuyên khoa tim mạch với 10 năm kinh nghiệm.",
        },
        bacsi_phone: "0123456789",
        featured_media: 0, // No featured media
      };

      const result = validator.validate(doctorWithoutPhoto);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Consider adding a professional profile photo",
      );
    });
  });

  describe("ServiceValidator", () => {
    let validator: ServiceValidator;

    beforeEach(() => {
      validator = new ServiceValidator();
    });

    it("should validate service with pricing information", () => {
      const validService = {
        id: 123,
        title: { rendered: "Khám tim mạch" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered:
            "Dịch vụ khám tim mạch chuyên sâu với đội ngũ bác sĩ giàu kinh nghiệm. Giá khám: 500.000 VNĐ. Bao gồm siêu âm tim và điện tâm đồ.",
        },
      };

      const result = validator.validate(validService);
      expect(result.isValid).toBe(true);
    });

    it("should warn about missing pricing information", () => {
      const serviceWithoutPricing = {
        id: 123,
        title: { rendered: "Khám tim mạch" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: {
          rendered:
            "Dịch vụ khám tim mạch chuyên sâu với đội ngũ bác sĩ giàu kinh nghiệm.",
        },
      };

      const result = validator.validate(serviceWithoutPricing);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Consider adding pricing information for better user experience",
      );
    });

    it("should warn about short service description", () => {
      const serviceWithShortDescription = {
        id: 123,
        title: { rendered: "Khám tim mạch" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
        content: { rendered: "Khám tim mạch. Giá: 500.000 VNĐ." }, // Less than 100 characters
      };

      const result = validator.validate(serviceWithShortDescription);
      expect(result.isValid).toBe(true); // Warning, not error
      expect(result.warnings).toContain(
        "Consider adding more detailed service description",
      );
    });
  });

  describe("ValidationUtils", () => {
    it("should create appropriate validator for content type", () => {
      const doctorValidator = ValidationUtils.createValidator("doctor");
      expect(doctorValidator).toBeInstanceOf(DoctorValidator);

      const serviceValidator = ValidationUtils.createValidator("service");
      expect(serviceValidator).toBeInstanceOf(ServiceValidator);

      const postValidator = ValidationUtils.createValidator("post");
      expect(postValidator).toBeInstanceOf(MedicalContentValidator);

      const defaultValidator = ValidationUtils.createValidator("unknown");
      expect(defaultValidator).toBeInstanceOf(WordPressValidator);
    });

    it("should validate WordPress content quickly", () => {
      const validContent = {
        id: 123,
        title: { rendered: "Test Title" },
        status: "publish",
        date: "2024-01-01T00:00:00Z",
      };

      expect(ValidationUtils.validateWPContent(validContent)).toBe(true);

      const invalidContent = { name: "Test" }; // Missing required fields
      expect(ValidationUtils.validateWPContent(invalidContent)).toBe(false);
    });

    it("should filter valid content from array", () => {
      const mixedContent = [
        {
          id: 1,
          title: { rendered: "Valid 1" },
          status: "publish",
          date: "2024-01-01T00:00:00Z",
        },
        { name: "Invalid" }, // Missing required fields
        {
          id: 2,
          title: { rendered: "Valid 2" },
          status: "publish",
          date: "2024-01-01T00:00:00Z",
        },
      ];

      const validContent = ValidationUtils.filterValidContent(
        mixedContent,
        "post",
      );
      expect(validContent).toHaveLength(2);
      expect(validContent[0].id).toBe(1);
      expect(validContent[1].id).toBe(2);
    });

    it("should provide validation summary for content array", () => {
      const mixedContent = [
        {
          id: 1,
          title: { rendered: "Valid 1" },
          status: "publish",
          date: "2024-01-01T00:00:00Z",
        },
        { name: "Invalid" }, // Missing required fields
        {
          id: 2,
          title: { rendered: "Valid 2" },
          status: "publish",
          date: "2024-01-01T00:00:00Z",
        },
      ];

      const summary = ValidationUtils.getValidationSummary(
        mixedContent,
        "post",
      );

      expect(summary.summary.total).toBe(3);
      expect(summary.summary.valid).toBe(2);
      expect(summary.summary.invalid).toBe(1);
      expect(summary.results).toHaveLength(3);
    });
  });
});
