/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
  webpack: (config) => {
    // Combine both video rules into one
    config.module.rules.push({
      test: /\.(mp4|webm)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/videos/',
            outputPath: 'static/videos/',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {},
  async headers() {
    return [
      {
        source: '/weblik/builder',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
