import process from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@fiap-tech-challenge/design-system"],
  output: 'standalone',
  rewrites: async () => [
    {
      source: `/auth/:path+`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/:path+`,
    },
    {
      source: `/api/auth`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/api/auth`,
    },
    {
      source: `/api/auth/:path+`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/api/auth/:path+`,
    },
    {
      source: `/bytebank-web-auth-static/:path+`,
      destination: `${process.env.BYTEBANK_WEB_AUTH_DOMAIN}/bytebank-web-auth-static/:path+`,
    },
  ],
};

export default nextConfig;
