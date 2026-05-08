import type { NextConfig } from "next";

const config: NextConfig = {
  // canopy-i18n はローカル symlink で参照される (../../) ため、
  // モノレポ的に外部リンクを許可する設定は不要
};

export default config;
