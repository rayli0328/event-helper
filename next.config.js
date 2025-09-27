/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Allow access from other devices on the network
  async rewrites() {
    return [];
  },
  webpack: (config, { isServer }) => {
    // Fix for undici compatibility issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        path: false,
      };
    }
    
    // Handle undici module parsing with better configuration
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Exclude undici from webpack processing
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'undici': 'undici'
      });
    }

    return config;
  },
  transpilePackages: ['undici'],
}

module.exports = nextConfig