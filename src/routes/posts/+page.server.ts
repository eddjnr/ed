import { parsePostMetadata, slugFromPostPath, type PostSummary } from "$lib/content/posts";
import type { PageServerLoad } from "./$types";

const metadataByPath = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  import: "metadata",
}) as Record<string, unknown>;

export const load: PageServerLoad = () => {
  const posts: PostSummary[] = Object.entries(metadataByPath)
    .map(([path, value]) => ({
      slug: slugFromPostPath(path),
      ...parsePostMetadata(value, path),
    }))
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  return { posts };
};
