/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {source: '/zh-CN', destination: '/', permanent: true},
      {source: '/zh-CN/:path*', destination: '/:path*', permanent: true},
    ]
  },
  async rewrites() {
    return {
      // Keep the established Chinese paths and share every page with its English counterpart.
      beforeFiles: [
        {source: '/', destination: '/zh-CN'},
        {
          source: '/:path((?!(?:en|zh-CN|_next|_vercel|api)(?:/|$))[^.]+)',
          destination: '/zh-CN/:path',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

module.exports = nextConfig
