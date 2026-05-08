// LOCALES は server component (generateStaticParams) からも使うため、
// "use client" を付けずに別ファイルに分離する
export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];
