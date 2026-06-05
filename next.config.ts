import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.eurocampingonline.com.ar",
        pathname: "/images/productos/**",
      },
    ],
  },
};

export default nextConfig;
