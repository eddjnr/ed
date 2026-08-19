import { site } from "$lib/seo";
import { parsePostMetadata, slugFromPostPath } from "$lib/content/posts";
import type { RequestHandler } from "./$types";

export const prerender = true;

const metadataByPath = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  import: "metadata",
}) as Record<string, unknown>;

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });

export const GET: RequestHandler = () => {
  type SitemapEntry = {
    path: string;
    priority: string;
    changeFrequency: string;
    lastModified?: string;
  };

  const staticPages: SitemapEntry[] = [
    { path: "/", priority: "1.0", changeFrequency: "monthly" },
    { path: "/projects", priority: "0.8", changeFrequency: "monthly" },
    { path: "/about", priority: "0.7", changeFrequency: "yearly" },
    { path: "/posts", priority: "0.8", changeFrequency: "weekly" },
    { path: "/contact", priority: "0.5", changeFrequency: "yearly" },
  ];
  const posts: SitemapEntry[] = Object.entries(metadataByPath)
    .map(([path, value]) => ({
      slug: slugFromPostPath(path),
      ...parsePostMetadata(value, path),
    }))
    .filter((post) => post.published)
    .map((post) => ({
      path: `/posts/${post.slug}`,
      priority: "0.7",
      changeFrequency: "monthly",
      lastModified: post.date,
    }));

  const urls = [...staticPages, ...posts]
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(new URL(entry.path, site.url).toString())}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ""}
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
};
