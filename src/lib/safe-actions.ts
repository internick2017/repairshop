import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

// Create a simple action client without metadata for basic CRUD operations
export const action = createSafeActionClient({
  handleServerError: (error) => {
    Sentry.captureException(error);
    if(error.constructor.name === "DatabaseError") {
      return {
        serverError: "Database error. Please contact support.",
      };
    }
    return {
      serverError: "Something went wrong. Please try again.",
    };
  },
});

// Create an action client with metadata for authenticated operations
export const authenticatedAction = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      userId: z.string().optional(),
    });
  },
  handleServerError: (error, utils) => {
    const { clientInput, metadata } = utils;
    Sentry.captureException(error, (scope) => {
      scope.setContext("clientInput", {clientInput});
      scope.setContext("metadata", {userId: metadata.userId});
      return scope;
    });
    if(error.constructor.name === "DatabaseError") {
      return {
        serverError: "Database error. Please contact support.",
      };
    }
    return {
      serverError: "Something went wrong. Please try again.",
    };
  },
});

// Common error response type
export type ActionResponse<T> = {
  data?: T;
  serverError?: string;
  validationErrors?: Record<string, string[]>;
};

// Common success response type
export type ActionSuccess<T> = {
  data: T;
  serverError?: never;
  validationErrors?: never;
}; 