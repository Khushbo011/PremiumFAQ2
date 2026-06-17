import { createRequestHandler } from "react-router";

// Vercel serverless function entry point
export default createRequestHandler({
  build: () => import("../build/server/index.js"),
  mode: process.env.NODE_ENV ?? "production",
});
