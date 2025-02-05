import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the environment variables for the application.
 * It is used to validate the environment variables and provide type safety.
 *
 * @see https://create.t3.gg/en/usage/env-variables
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development")
  },
  client: {
    // Webpack Bundle Analyzer
    NEXT_PUBLIC_ANALYZE: z.coerce.boolean().default(false),

    // Development Mode
    NEXT_PUBLIC_DEV: z.enum(["ON", "OFF"]).default("OFF"),

    // API and CDN URLs
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CDN_BASE_URL: z.string().url(),
    NEXT_PUBLIC_URL: z.string().url(),

    // Network and Node Configuration
    NEXT_PUBLIC_NETWORK_ID: z.coerce.number(),
    NEXT_PUBLIC_BSC_NODE: z.string().url(),

    // Web3 Configuration
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_PROJECT_NAME: z.string(),
    NEXT_PUBLIC_INFURA_KEY: z.string(),

    // Communication Services
    NEXT_PUBLIC_SOCKET_URL: z.string().url(),
    NEXT_PUBLIC_TENOR_API_KEY: z.string()
  },
  runtimeEnv: {
    // SERVER ENVIRONMENT VARIABLES
    NODE_ENV: process.env.NODE_ENV,

    // CLIENT ENVIRONMENT VARIABLES

    // Webpack Bundle Analyzer
    NEXT_PUBLIC_ANALYZE: process.env.ANALYZE,

    // Development Mode
    NEXT_PUBLIC_DEV: process.env.NEXT_PUBLIC_DEV,

    // API and CDN URLs
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

    // Network and Node Configuration
    NEXT_PUBLIC_NETWORK_ID: process.env.NEXT_PUBLIC_NETWORK_ID,
    NEXT_PUBLIC_BSC_NODE: process.env.NEXT_PUBLIC_BSC_NODE,

    // Web3 Configuration
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_PROJECT_NAME: process.env.NEXT_PUBLIC_PROJECT_NAME,
    NEXT_PUBLIC_INFURA_KEY: process.env.NEXT_PUBLIC_INFURA_KEY,

    // Communication Services
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_TENOR_API_KEY: process.env.NEXT_PUBLIC_TENOR_API_KEY
  },
  /**
   * Default error handler for invalid environment variables.
   * docs: https://env.t3.gg/docs/customization#overriding-the-default-error-handler
   */

  // Called when the schema validation fails.
  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables:", issues);
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable on the client: ${variable}`
    );
  }
});
