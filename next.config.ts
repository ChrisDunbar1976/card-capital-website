import type { NextConfig } from "next";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_SUPABASE_URL: "https://ymzjtqpsawwybsfexuhb.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "sb_publishable_SYM1in6wEl93VWD_mgjv0Q_6Me0nPL3",
  },
};

export default nextConfig;
