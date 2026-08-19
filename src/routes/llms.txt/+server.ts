import { site } from "$lib/seo";
import { parsePostMetadata, slugFromPostPath } from "$lib/content/posts";
import type { RequestHandler } from "./$types";

export const prerender = true;

const metadataByPath = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  import: "metadata",
}) as Record<string, unknown>;

export const GET: RequestHandler = () => {
  const posts = Object.entries(metadataByPath)
    .map(([path, value]) => ({
      slug: slugFromPostPath(path),
      ...parsePostMetadata(value, path),
    }))
    .filter((post) => post.published)
    .map((post) => `- [${post.title}](${site.url}/posts/${post.slug}): ${post.description}`);

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Ed is a software engineer in Campinas, Brazil. He focuses on frontend architecture, design systems, accessible interfaces and thoughtfully engineered digital products.",
    "",
    "## Primary pages",
    "",
    `- [Home](${site.url}/): Biography, selected projects and professional overview.`,
    `- [Projects](${site.url}/projects): Selected product work, experiments and research.`,
    `- [About](${site.url}/about): Professional experience, education and credentials.`,
    `- [Writing](${site.url}/posts): Articles about software and product engineering.`,
    `- [Contact](${site.url}/contact): Email and professional profiles.`,
    "",
    "## Articles",
    "",
    ...posts,
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    "- GitHub: https://github.com/eddjnr/",
    "- LinkedIn: https://www.linkedin.com/in/junior-albuquerque/",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
