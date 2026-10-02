import type { NextConfig } from 'next';
const config: NextConfig = {
  devIndicators: false,
  // Keep local builds usable on memory-constrained development machines.
  experimental: { cpus: 1 },
};
export default config;
