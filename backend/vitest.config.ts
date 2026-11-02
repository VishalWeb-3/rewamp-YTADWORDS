import { defineConfig } from "vitest/config";

// Tests run against a throwaway SQLite file that globalSetup rebuilds from migrations/
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/globalSetup.ts"],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./tests/.test.db",
      FRONTEND_URL: "http://localhost:5173",
      API_URL: "http://localhost:5001",
      CRYPTOMUS_API_KEY: "test-cryptomus-key",
      CRYPTOMUS_MERCHANT_ID: "test-merchant",
      WEBHOOK_SECRET: "test-webhook-secret",
      ADMIN_API_KEY: "test-admin-key",
      PASSWORD_PEPPER: "test-password-pepper",
    },
  },
});
