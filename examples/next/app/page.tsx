import Link from "next/link";

export default function Root() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Canopy i18n × Next.js Examples</h1>
      <ul>
        <li>
          <Link href="/en">/[locale] (default key)</Link>
        </li>
        <li>
          <Link href="/custom/en">/custom/[lang] (custom paramKey + pathPrefix)</Link>
        </li>
      </ul>
    </main>
  );
}
