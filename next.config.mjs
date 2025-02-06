/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'query',
              key: '_nextAlias',
              value: 'true',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
  // Add trailing slash configuration to ensure consistent handling
  trailingSlash: false,
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
