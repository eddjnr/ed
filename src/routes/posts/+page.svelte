<script lang="ts">
	import { formatCalendarDate } from '$lib/utils/date';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SeoHead
	title="Software Engineering Articles by Ed"
	description="Read Ed's notes on frontend architecture, software engineering, product development, web technologies and AI-assisted development."
	path="/posts"
/>

<div class="page">
	<header class="reveal">
		<span class="eyebrow">
			Journal · {String(data.posts.length).padStart(2, '0')}
			{data.posts.length === 1 ? 'article' : 'articles'}
		</span>
		<h1 class="page-title">Writing</h1>
		<p class="lede">Notes on software, product engineering and the web.</p>
	</header>

	<section class="article-list reveal" style="--delay: 80ms" aria-label="Articles">
		{#each data.posts as post, index}
			<a class="article-row" href="/posts/{post.slug}">
				<span class="article-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
				<span class="article-copy">
					<strong>{post.title}</strong>
					<time datetime={post.date}>Published {formatCalendarDate(post.date, 'short')}</time>
					<small>{post.description}</small>
				</span>
				<span class="article-arrow" aria-hidden="true">→</span>
			</a>
		{:else}
			<div class="empty-state">
				<strong>No articles yet</strong>
				<p>New notes about software and product engineering will appear here.</p>
			</div>
		{/each}
	</section>
</div>

<style>
	header .lede {
		margin: 0.75rem 0 0;
	}
	.article-list {
		margin-top: 3rem;
		border-top: 1px solid var(--line);
	}
	.article-row {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) 1rem;
		min-height: 8rem;
		align-items: start;
		gap: 1rem;
		padding-block: 1.5rem;
		border-bottom: 1px solid var(--line);
		color: var(--ink);
		text-decoration: none;
		transition-property: scale;
		transition-duration: 160ms;
		transition-timing-function: ease-out;
	}
	.article-index {
		padding-top: 0.15rem;
		color: var(--quiet);
		font-family: var(--mono);
		font-size: 0.625rem;
		font-variant-numeric: tabular-nums;
	}
	.article-copy {
		display: flex;
		min-width: 0;
		flex-direction: column;
		transition-property: transform;
		transition-duration: 160ms;
		transition-timing-function: ease-out;
	}
	.article-copy strong {
		max-width: 32rem;
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.4;
		letter-spacing: -0.015em;
		text-wrap: balance;
	}
	.article-copy time {
		margin-top: 0.2rem;
		color: var(--quiet);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
	}
	.article-copy small {
		max-width: 34rem;
		margin-top: 0.65rem;
		color: var(--muted);
		font-size: 0.8125rem;
		line-height: 1.55;
		text-wrap: pretty;
	}
	.article-arrow {
		padding-top: 0.1rem;
		color: var(--quiet);
		font-size: 0.75rem;
		transition-property: color, transform;
		transition-duration: 160ms;
		transition-timing-function: ease-out;
	}
	.article-row:active {
		scale: 0.96;
	}
	.empty-state {
		padding-block: 1.5rem;
		border-bottom: 1px solid var(--line);
	}
	.empty-state strong {
		font-size: 0.875rem;
		font-weight: 600;
	}
	.empty-state p {
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 0.8125rem;
	}
	@media (hover: hover) {
		.article-row:hover .article-copy {
			transform: translateX(0.125rem);
		}
		.article-row:hover .article-arrow {
			color: var(--ink);
			transform: translateX(0.15rem);
		}
	}
	@media (max-width: 42rem) {
		.article-row {
			grid-template-columns: 1.25rem minmax(0, 1fr) 1rem;
			min-height: auto;
			gap: 0.75rem;
			padding-block: 1.25rem;
		}
	}
</style>
