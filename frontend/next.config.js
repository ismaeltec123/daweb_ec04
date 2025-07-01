/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones
  eslint: {
    // Advertencias de ESLint no causarán que falle la compilación en producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TS errors no causarán que falle la compilación en producción
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['ejemplo.com', 'placehold.it', 'placekitten.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;