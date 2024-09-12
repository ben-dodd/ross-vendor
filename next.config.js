/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'localhost',
      'hmn.exu.mybluehost.me',
      'img.discogs.com',
      'i.discogs.com',
      'books.google.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/file/:path*',
        destination: 'https://hmn.exu.mybluehost.me/:path*',
      },
    ]
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
