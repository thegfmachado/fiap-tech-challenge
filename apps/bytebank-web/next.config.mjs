import process from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@fiap-tech-challenge/design-system"],
  rewrites: async () => [
    {
      source: `/auth/:path+`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/:path+`,
    },
    {
      source: `/${process.env.BYTEBANK_WEB_AUTH_STATIC_PATH}/:path+`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/${process.env.BYTEBANK_WEB_AUTH_STATIC_PATH}/:path+`,
    },
  ],
};

export default nextConfig;
