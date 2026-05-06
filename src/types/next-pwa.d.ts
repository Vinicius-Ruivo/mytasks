declare module "next-pwa" {
  import type { NextConfig } from "next";

  type PwaOptions = {
    dest: string;
    disable?: boolean;
  };

  type WithPwa = (config: NextConfig) => NextConfig;

  export default function withPWAInit(options: PwaOptions): WithPwa;
}
