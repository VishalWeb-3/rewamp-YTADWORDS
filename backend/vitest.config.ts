import { defineConfig } from "vitest/config";

// Tests need a disposable Postgres database. TEST_DATABASE_URL is wiped before each run.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgresql://test:test@localhost:55432/ytadw",
      FRONTEND_URL: "http://localhost:5173",
      API_URL: "http://localhost:5001",
      CRYPTOMUS_API_KEY: "test-cryptomus-key",
      CRYPTOMUS_MERCHANT_ID: "test-merchant",
      WEBHOOK_SECRET: "test-webhook-secret",
    },
  },
});
