/**
 * Service Factory Tests
 * Comprehensive tests for the service factory pattern implementation
 *
 * @version 1.0.0
 * @author Zalo Healthcare Development Team
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  createService,
  serviceRegistry,
  ServiceConfig,
  ServiceMethods,
} from "../base/service-factory";
import { QueryParams, FetchOptions } from "../cache";

// Mock data types for testing
interface TestEntity {
  id: number;
  name: string;
  type: string;
}

interface TestQueryParams extends QueryParams {
  category?: string;
}

describe("Service Factory", () => {
  let mockMethods: ServiceMethods<TestEntity, TestQueryParams>;
  let mockConfig: ServiceConfig<TestEntity, TestQueryParams>;

  beforeEach(() => {
    // Reset service registry
    serviceRegistry["services"].clear();

    // Mock service methods
    mockMethods = {
      getList: jest.fn().mockResolvedValue([
        { id: 1, name: "Test Entity 1", type: "test" },
        { id: 2, name: "Test Entity 2", type: "test" },
      ]),
      getById: jest
        .fn()
        .mockResolvedValue({ id: 1, name: "Test Entity 1", type: "test" }),
      search: jest
        .fn()
        .mockResolvedValue([{ id: 1, name: "Test Entity 1", type: "test" }]),
    };

    mockConfig = {
      name: "test-service",
      defaultParams: { per_page: 10 },
      defaultOptions: { cache: true },
      transformer: (entity: any) => ({ ...entity, transformed: true }),
      validator: (entity: any) => entity && entity.id > 0,
    };
  });

  describe("createService", () => {
    it("should create a service with correct structure", () => {
      const service = createService(mockConfig, mockMethods);

      expect(service).toHaveProperty("config");
      expect(service).toHaveProperty("methods");
      expect(service).toHaveProperty("atoms");
      expect(service.config).toBe(mockConfig);
      expect(service.methods).toBe(mockMethods);
    });

    it("should create atom families", () => {
      const service = createService(mockConfig, mockMethods);

      expect(service.atoms).toHaveProperty("listAtomFamily");
      expect(service.atoms).toHaveProperty("itemAtomFamily");
      expect(service.atoms).toHaveProperty("searchAtomFamily");
    });

    it("should create service without search if not provided", () => {
      const methodsWithoutSearch = {
        getList: mockMethods.getList,
        getById: mockMethods.getById,
      };

      const service = createService(mockConfig, methodsWithoutSearch);

      expect(service.atoms).toHaveProperty("listAtomFamily");
      expect(service.atoms).toHaveProperty("itemAtomFamily");
      expect(service.atoms).not.toHaveProperty("searchAtomFamily");
    });
  });

  describe("Service Registry", () => {
    it("should register and retrieve services", () => {
      const service = createService(mockConfig, mockMethods);
      serviceRegistry.register(service);

      const retrievedService = serviceRegistry.get("test-service");
      expect(retrievedService).toBe(service);
    });

    it("should check if service exists", () => {
      const service = createService(mockConfig, mockMethods);
      serviceRegistry.register(service);

      expect(serviceRegistry.has("test-service")).toBe(true);
      expect(serviceRegistry.has("non-existent")).toBe(false);
    });

    it("should return all registered services", () => {
      const service1 = createService(mockConfig, mockMethods);
      const service2 = createService(
        { ...mockConfig, name: "test-service-2" },
        mockMethods,
      );

      serviceRegistry.register(service1);
      serviceRegistry.register(service2);

      const allServices = serviceRegistry.getAll();
      expect(allServices).toHaveLength(2);
      expect(allServices).toContain(service1);
      expect(allServices).toContain(service2);
    });
  });

  describe("Service Atoms", () => {
    it("should call getList with merged parameters", async () => {
      const service = createService(mockConfig, mockMethods);
      const listAtom = service.atoms.listAtomFamily({ category: "medical" });

      await listAtom.read();

      expect(mockMethods.getList).toHaveBeenCalledWith(
        { per_page: 10, category: "medical" },
        { cache: true },
      );
    });

    it("should call getById with merged options", async () => {
      const service = createService(mockConfig, mockMethods);
      const itemAtom = service.atoms.itemAtomFamily(1);

      await itemAtom.read();

      expect(mockMethods.getById).toHaveBeenCalledWith(1, { cache: true });
    });

    it("should call search with merged parameters and options", async () => {
      const service = createService(mockConfig, mockMethods);
      const searchAtom = service.atoms.searchAtomFamily!("test query");

      await searchAtom.read();

      expect(mockMethods.search).toHaveBeenCalledWith(
        "test query",
        { per_page: 10 },
        { cache: true },
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle getList errors gracefully", async () => {
      const errorMethods = {
        ...mockMethods,
        getList: jest.fn().mockRejectedValue(new Error("Network error")),
      };

      const service = createService(mockConfig, errorMethods);
      const listAtom = service.atoms.listAtomFamily({});

      await expect(listAtom.read()).rejects.toThrow("Network error");
    });

    it("should handle getById errors gracefully", async () => {
      const errorMethods = {
        ...mockMethods,
        getById: jest.fn().mockRejectedValue(new Error("Not found")),
      };

      const service = createService(mockConfig, errorMethods);
      const itemAtom = service.atoms.itemAtomFamily(999);

      await expect(itemAtom.read()).rejects.toThrow("Not found");
    });
  });

  describe("Configuration Merging", () => {
    it("should merge default params with provided params", async () => {
      const configWithDefaults = {
        ...mockConfig,
        defaultParams: { per_page: 20, orderby: "date" },
      };

      const service = createService(configWithDefaults, mockMethods);
      const listAtom = service.atoms.listAtomFamily({
        category: "medical",
        per_page: 5,
      });

      await listAtom.read();

      expect(mockMethods.getList).toHaveBeenCalledWith(
        { per_page: 5, orderby: "date", category: "medical" },
        { cache: true },
      );
    });

    it("should merge default options with provided options", async () => {
      const configWithDefaults = {
        ...mockConfig,
        defaultOptions: { cache: false, retries: 3 },
      };

      const service = createService(configWithDefaults, mockMethods);
      const itemAtom = service.atoms.itemAtomFamily(1);

      await itemAtom.read();

      expect(mockMethods.getById).toHaveBeenCalledWith(1, {
        cache: false,
        retries: 3,
      });
    });
  });

  describe("Service Factory Integration", () => {
    it("should work with real-world service patterns", async () => {
      const realWorldMethods: ServiceMethods<TestEntity, TestQueryParams> = {
        getList: async (params = {}, options = {}) => {
          // Simulate API call
          return [
            { id: 1, name: "Doctor A", type: "doctor" },
            { id: 2, name: "Doctor B", type: "doctor" },
          ].filter((item) => !params.category || item.type === params.category);
        },
        getById: async (id: number, options = {}) => {
          // Simulate API call
          const items = [
            { id: 1, name: "Doctor A", type: "doctor" },
            { id: 2, name: "Doctor B", type: "doctor" },
          ];
          const item = items.find((i) => i.id === id);
          if (!item) throw new Error("Not found");
          return item;
        },
        search: async (query: string, params = {}, options = {}) => {
          // Simulate search
          const items = [
            { id: 1, name: "Doctor A", type: "doctor" },
            { id: 2, name: "Doctor B", type: "doctor" },
          ];
          return items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase()),
          );
        },
      };

      const realWorldConfig: ServiceConfig<TestEntity, TestQueryParams> = {
        name: "doctors",
        defaultParams: { per_page: 10, orderby: "name" },
        defaultOptions: { cache: true, retries: 2 },
        validator: (entity) =>
          entity && entity.id > 0 && entity.name.length > 0,
      };

      const service = createService(realWorldConfig, realWorldMethods);
      serviceRegistry.register(service);

      // Test list functionality
      const listAtom = service.atoms.listAtomFamily({ category: "doctor" });
      const listResult = await listAtom.read();
      expect(listResult).toHaveLength(2);

      // Test item functionality
      const itemAtom = service.atoms.itemAtomFamily(1);
      const itemResult = await itemAtom.read();
      expect(itemResult.name).toBe("Doctor A");

      // Test search functionality
      const searchAtom = service.atoms.searchAtomFamily!("Doctor A");
      const searchResult = await searchAtom.read();
      expect(searchResult).toHaveLength(1);
      expect(searchResult[0].name).toBe("Doctor A");
    });
  });
});
