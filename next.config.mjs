/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['10.0.21.86', '10.137.187.52'],
  serverExternalPackages: ['react-pdf', 'pdfjs-dist'],
}

export default nextConfig
