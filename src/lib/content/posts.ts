import type { Component } from "svelte";

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  published: boolean;
};

export type PostSummary = PostMetadata & { slug: string };

export type PostModule = {
  default: Component;
  metadata: unknown;
};

export function slugFromPostPath(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

export function parsePostMetadata(value: unknown, source: string): PostMetadata {
  if (!value || typeof value !== "object") {
    throw new TypeError(`Missing post metadata in ${source}`);
  }

  const metadata = value as Record<string, unknown>;
  const requiredStrings = ["title", "description", "date"] as const;

  for (const field of requiredStrings) {
    if (typeof metadata[field] !== "string" || metadata[field].trim() === "") {
      throw new TypeError(`Invalid ${field} in ${source}`);
    }
  }

  if (typeof metadata.published !== "boolean") {
    throw new TypeError(`Invalid published flag in ${source}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date as string)) {
    throw new TypeError(`Invalid date in ${source}`);
  }

  return {
    title: metadata.title as string,
    description: metadata.description as string,
    date: metadata.date as string,
    published: metadata.published,
  };
}
