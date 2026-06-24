import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias["@finsphere/shared"] = path.resolve("../../packages/shared/dist/index.js");
    return config;
  }
};

export default nextConfig;
