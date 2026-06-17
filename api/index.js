import { createRequestHandler } from "@react-router/node";

// This is the Vercel serverless function entry point.
// It handles ALL server-side requests that aren't static assets.
export default createRequestHandler({
  // Dynamically import the React Router server build
  build: () => import("../build/server/index.js"),
  mode: process.env.NODE_ENV ?? "production",
});
