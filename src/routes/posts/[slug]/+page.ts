import { parsePostMetadata, slugFromPostPath, type PostModule } from "$lib/content/posts";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageLoad } from "./$types";

const postModules = import.meta.glob<PostModule>("/src/content/blog/*.md");
const metadataByPath = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  import: "metadata",
}) as Record<string, unknown>;

export const entries: EntryGenerator = () =>
  Object.entries(metadataByPath)
    .filter(([path, value]) => parsePostMetadata(value, path).published)
    .map(([path]) => ({ slug: slugFromPostPath(path) }));

export const load: PageLoad = async ({ params }) => {
  const path = `/src/content/blog/${params.slug}.md`;
  const loadPost = postModules[path];
  const rawMetadata = metadataByPath[path];

  if (!loadPost || !rawMetadata) throw error(404, `Post "${params.slug}" not found`);

  const metadata = parsePostMetadata(rawMetadata, path);
  if (!metadata.published) throw error(404, `Post "${params.slug}" not found`);

  const post = await loadPost();
  return { content: post.default, metadata, slug: params.slug };
};
