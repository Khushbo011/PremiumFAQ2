import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

// Vercel serverless function entry point
export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV ?? "production",
});
