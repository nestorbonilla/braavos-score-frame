/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/leaderboard',
        destination: 'https://github.com/nestorbonilla',
        permanent: false
      },
      {
        source: '/finalized',
        destination: 'https://instagram.com/nestorbonilla',
        permanent: false
      },
    ];
  }
};

export default nextConfig;
