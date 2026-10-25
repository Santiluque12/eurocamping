import type { NextConfig } from "next";

// Imágenes subidas desde el administrador (Supabase Storage).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
const isLocalSupabase = !!supabaseUrl && ["127.0.0.1", "localhost"].includes(supabaseUrl.hostname);

const nextConfig: NextConfig = {
  // Hay otro package-lock.json en el directorio del usuario: fijar la raíz.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.eurocampingonline.com.ar",
        pathname: "/images/productos/**",
      },
      ...(supabaseUrl
        ? [
            {
              protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
              hostname: supabaseUrl.hostname,
              port: supabaseUrl.port,
              pathname: "/storage/v1/object/public/media/**",
            },
          ]
        : []),
    ],
    // Sólo en desarrollo con Supabase local (127.0.0.1).
    dangerouslyAllowLocalIP: isLocalSupabase,
  },
};

export default nextConfig;
