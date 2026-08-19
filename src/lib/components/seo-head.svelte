<script lang="ts">
  import { site } from "$lib/seo";

  let {
    title,
    description,
    path,
    type = "WebPage",
    publishedTime,
  }: {
    title: string;
    description: string;
    path: string;
    type?: "WebPage" | "Article";
    publishedTime?: string;
  } = $props();

  const absoluteUrl = (value: string) => new URL(value, site.url).toString();

  let canonical = $derived(absoluteUrl(path));
  let pageId = $derived(`${canonical}#webpage`);
  let schemas = $derived.by(() => {
    const graph: Record<string, unknown>[] = [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: `${site.url}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(site.logo),
        },
        founder: { "@id": `${site.url}/#person` },
        sameAs: [
          "https://github.com/eddjnr/",
          "https://www.linkedin.com/in/junior-albuquerque/",
        ],
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.shortName,
        jobTitle: "Software Engineer",
        url: `${site.url}/`,
        image: absoluteUrl(site.socialImage),
        email: `mailto:${site.email}`,
        worksFor: {
          "@type": "Organization",
          name: "Conexa Saúde",
        },
        sameAs: [
          "https://github.com/eddjnr/",
          "https://www.linkedin.com/in/junior-albuquerque/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": type,
        "@id": pageId,
        url: canonical,
        name: title,
        headline: title,
        description,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#person` },
        mainEntityOfPage: { "@id": pageId },
        inLanguage: "en",
        ...(type === "Article"
          ? {
              datePublished: publishedTime,
              author: { "@id": `${site.url}/#person` },
              publisher: { "@id": `${site.url}/#organization` },
              image: absoluteUrl(site.socialImage),
            }
          : {}),
      },
    ];

    return { "@context": "https://schema.org", "@graph": graph };
  });

  let jsonLd = $derived(JSON.stringify(schemas).replace(/</g, "\\u003c"));
  let schemaTag = $derived(
    `<script type="application/ld+json">${jsonLd}</scr` + "ipt>",
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:type" content={type === "Article" ? "article" : "website"} />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={absoluteUrl(site.socialImage)} />
  <meta property="og:image:alt" content="Portrait of Ed, a software engineer" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={absoluteUrl(site.socialImage)} />

  {#if type === "Article" && publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}

  {@html schemaTag}
</svelte:head>
