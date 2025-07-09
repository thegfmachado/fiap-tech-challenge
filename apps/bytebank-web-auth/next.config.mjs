/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@fiap-tech-challenge/design-system"],
  assetPrefix: "/bytebank-web-auth-static",
  rewrites: async () => [
    {
      source: "/",
      destination: "/login",
    },
    {
      source: `/auth/:path+`,
      destination: `/:path+`,
    },
  ],
};

export default nextConfig;
