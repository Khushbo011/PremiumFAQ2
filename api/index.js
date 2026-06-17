// @react-router/node is a CJS module — must use default import in ESM context
// Named import { createRequestHandler } does NOT work with CJS modules in Node ESM
import pkg from "@react-router/node";
const { createRequestHandler } = pkg;

// Vercel serverless function entry point for React Router SSR
export default createRequestHandler({
  build: () => import("../build/server/index.js"),
  mode: process.env.NODE_ENV ?? "production",
});
