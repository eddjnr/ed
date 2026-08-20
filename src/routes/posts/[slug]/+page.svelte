<script lang="ts">
	import { tick } from 'svelte';
	import { copyableCode } from '$lib/actions/copyable-code';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { formatCalendarDate } from '$lib/utils/date';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	type Heading = { id: string; label: string; level: 2 | 3 };
	let headings = $state<Heading[]>([]);
	let activeHeading = $state('');
	let railPath = $state('');
	let railHeight = $state(0);
	let activeRailTop = $state(0);
	let activeRailBottom = $state(0);
	let railFrame = 0;

	function railX(link: HTMLAnchorElement) {
		return link.dataset.level === '3' ? 16.5 : 8.5;
	}

	function measureRail(node: HTMLElement) {
		cancelAnimationFrame(railFrame);
		railFrame = requestAnimationFrame(() => {
			const content = node.querySelector<HTMLElement>('[data-toc-content]');
			if (!content) return;

			const links = Array.from(content.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
			if (links.length === 0) return;

			const height = Math.ceil(content.offsetHeight);
			const startY = Math.min(6, height);
			let previousX = railX(links[0]);
			let path = `M ${previousX} ${startY}`;

			for (const link of links.slice(1)) {
				const nextX = railX(link);
				const boundary = link.offsetTop;
				const curveStart = Math.max(startY, boundary - 6);
				const curveEnd = Math.min(height, boundary + 6);
				path += ` L ${previousX} ${curveStart} C ${previousX} ${boundary + 2} ${nextX} ${boundary - 2} ${nextX} ${curveEnd}`;
				previousX = nextX;
			}

			path += ` L ${previousX} ${height}`;
			railPath = path;
			railHeight = height;

			const activeLink = links.find((link) => link.dataset.active === 'true');
			if (activeLink) {
				activeRailTop = activeLink.offsetTop;
				activeRailBottom = activeLink.offsetTop + activeLink.offsetHeight;
			}
		});
	}

	function tocRail(node: HTMLElement, _activeId: string) {
		const resizeObserver = new ResizeObserver(() => measureRail(node));
		const content = node.querySelector<HTMLElement>('[data-toc-content]');
		if (content) resizeObserver.observe(content);
		measureRail(node);

		return {
			update() {
				void updateRailAfterRender(node);
			},
			destroy() {
				cancelAnimationFrame(railFrame);
				resizeObserver.disconnect();
			}
		};
	}

	async function updateRailAfterRender(node: HTMLElement) {
		await tick();
		measureRail(node);
	}

	function tableOfContents(node: HTMLElement) {
		const usedIds = new Set<string>();
		const elements = Array.from(node.querySelectorAll<HTMLElement>('h2, h3'));

		headings = elements.map((heading, index) => {
			const label = heading.textContent?.trim() || `Section ${index + 1}`;
			const baseId =
				heading.id ||
				label
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '') ||
				`section-${index + 1}`;
			let id = baseId;
			let suffix = 2;

			while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
			usedIds.add(id);
			heading.id = id;

			return {
				id,
				label,
				level: Number(heading.tagName.slice(1)) as 2 | 3
			};
		});

		let frame = 0;
		const updateActiveHeading = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const current = elements.reduce((active, heading) => {
					return heading.getBoundingClientRect().top <= 160 ? heading : active;
				}, elements[0]);
				const nextActiveHeading = current?.id ?? '';
				if (activeHeading !== nextActiveHeading) activeHeading = nextActiveHeading;
			});
		};

		updateActiveHeading();
		window.addEventListener('scroll', updateActiveHeading, { passive: true });

		const initialHeading = decodeURIComponent(window.location.hash.slice(1));
		if (initialHeading) {
			requestAnimationFrame(() => scrollToHeading(initialHeading));
		}

		return {
			destroy() {
				cancelAnimationFrame(frame);
				window.removeEventListener('scroll', updateActiveHeading);
			}
		};
	}

	function scrollToHeading(id: string, updateHistory = false) {
		const target = document.getElementById(id);
		if (!target) return;

		const root = document.documentElement;
		const previousBehavior = root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto';
		if (updateHistory) history.pushState(null, '', `#${id}`);
		target.scrollIntoView();
		requestAnimationFrame(() => {
			root.style.scrollBehavior = previousBehavior;
		});
	}

	function jumpToHeading(event: MouseEvent, id: string) {
		event.preventDefault();
		scrollToHeading(id, true);
	}
</script>

<SeoHead
	title={`${data.metadata.title} — Ed`}
	description={data.metadata.description}
	path={`/posts/${data.slug}`}
	type="Article"
	publishedTime={data.metadata.date}
/>

<article class="page relative w-full">
	<div class="block">
		{#if headings.length > 0}
			<div
				class="absolute inset-y-0 left-[calc((100vw-42rem)/-2+1.5rem)] w-[min(15rem,calc((100vw-42rem)/2-3.5rem))] max-[1120px]:hidden"
			>
				<aside
					class="toc-panel reveal sticky top-[clamp(5.5rem,12vh,7rem)] max-h-[calc(100dvh-7rem)] overflow-y-auto py-1 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin]"
					aria-label="Table of contents"
				>
					<div
						class="mb-4 [font-family:var(--mono)] text-[0.625rem] tracking-[0.18em] text-[var(--muted)] uppercase"
					>
						On this page
					</div>
					<nav class="relative" aria-label="Article sections" use:tocRail={activeHeading}>
					{#if railPath}
						<svg
							class="pointer-events-none absolute top-0 -left-2 h-auto w-[1.53125rem] overflow-visible"
							aria-hidden="true"
							viewBox={`0 0 24.5 ${railHeight}`}
							width="24.5"
							height={railHeight}
						>
							<path
								d={railPath}
								fill="none"
								stroke="var(--quiet)"
								stroke-width="1"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
						<svg
							class="pointer-events-none absolute top-0 -left-2 h-auto w-[1.53125rem] overflow-visible transition-[clip-path] duration-[160ms] ease-out"
							aria-hidden="true"
							viewBox={`0 0 24.5 ${railHeight}`}
							width="24.5"
							height={railHeight}
							style:clip-path={`polygon(0px ${activeRailTop}px, 100% ${activeRailTop}px, 100% ${activeRailBottom}px, 0px ${activeRailBottom}px)`}
						>
							<path
								d={railPath}
								fill="none"
								stroke="var(--ink)"
								stroke-width="1"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
					{/if}
						<div class="relative grid" data-toc-content>
							{#each headings as heading}
						<a
							class="relative flex min-h-7 items-center py-1 pr-3 pl-3 text-[0.8125rem] leading-[1.45] [text-wrap:pretty] text-[var(--quiet)] no-underline transition-[color] duration-[160ms] hover:text-[var(--muted)] data-[active=true]:text-[var(--ink)] data-[level=3]:pl-5"
							data-toc-link
							data-active={heading.id === activeHeading}
							data-level={heading.level}
							href="#{heading.id}"
							aria-current={heading.id === activeHeading ? 'location' : undefined}
							onclick={(event) => jumpToHeading(event, heading.id)}
						>
							<span>{heading.label}</span>
						</a>
							{/each}
						</div>
					</nav>
				</aside>
			</div>
		{/if}

		<div class="w-full min-w-0">
			<header class="reveal">
				<a
					class="mb-[clamp(2rem,5vw,3rem)] inline-flex min-h-11 items-center gap-2 [font-family:var(--mono)] text-[0.6875rem] text-[var(--quiet)] no-underline transition-[color,transform] duration-[180ms] hover:-translate-x-0.5 hover:text-[var(--accent)] active:scale-[0.96]"
					href="/posts"><span aria-hidden="true">←</span> Writing</a
				>
				<div
					class="flex gap-6 [font-family:var(--mono)] text-[0.6875rem] text-[var(--quiet)] tabular-nums"
				>
					<time datetime={data.metadata.date}>{formatCalendarDate(data.metadata.date)}</time><span>Ed</span>
				</div>
				<h1
					class="mt-4 mb-0 [font-family:var(--font)] text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.03em] text-balance"
				>
					{data.metadata.title}
				</h1>
				<p class="mt-4 mb-0 max-w-[40rem] text-base leading-[1.7] text-[var(--muted)]">
					{data.metadata.description}
				</p>
			</header>
			<div
				class="reveal prose mt-12 max-w-[42rem] text-[var(--muted)]"
				style="--delay: 120ms"
				use:copyableCode
				use:tableOfContents
			>
				<data.content />
			</div>
		</div>
	</div>
</article>

<style>
	.toc-panel::-webkit-scrollbar-button {
		display: none;
		width: 0;
		height: 0;
	}

	.prose :global(h2) {
		margin: 3rem 0 1rem;
		color: var(--ink);
		font-family: var(--font);
		font-size: 1.125rem;
		font-weight: 600;
		letter-spacing: -0.015em;
	}
	.prose :global(h3) {
		margin: 2.5rem 0 0.75rem;
		color: var(--ink);
		font-size: 1rem;
		font-weight: 600;
	}
	.prose :global(h2),
	.prose :global(h3) {
		scroll-margin-top: 6rem;
		text-wrap: balance;
	}
	.prose :global(p),
	.prose :global(li) {
		line-height: 1.8;
	}
	.prose :global(p) {
		margin: 0 0 1.4rem;
	}
	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1.5rem;
		padding-left: 1.25rem;
	}
	.prose :global(strong) {
		color: var(--ink);
		font-weight: 600;
	}
	.prose :global(a) {
		color: var(--ink);
		text-decoration-color: var(--quiet);
		text-underline-offset: 0.25rem;
		transition-property: color, text-decoration-color;
		transition-duration: 180ms;
	}
	.prose :global(a:hover) {
		color: var(--accent);
		text-decoration-color: var(--accent);
	}
	.prose :global(.code-frame) {
		margin: 2rem 0;
		overflow: hidden;
		border-radius: 0.625rem;
		background: #0c0c0c;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
	}
	.prose :global(.code-header) {
		display: flex;
		min-height: 2.875rem;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.35rem 0 1rem;
		border-bottom: 1px solid var(--line);
		background: var(--surface);
	}
	.prose :global(.code-meta) {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--mono);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.3;
	}
	.prose :global(.code-language-icon) {
		display: grid;
		flex: none;
		place-items: center;
		color: #22d3ee;
	}
	.prose :global(.code-title) {
		overflow: hidden;
		color: var(--muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.prose :global(pre) {
		overflow-x: auto;
		margin: 2rem 0;
		padding: 1.25rem;
		border-radius: 0.5rem;
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--line);
	}
	.prose :global(.code-frame pre) {
		margin: 0;
		border-radius: 0;
		background: #0c0c0c;
		box-shadow: none;
	}
	.prose :global(code) {
		font-family: var(--mono);
		font-size: 0.875rem;
	}
	.prose :global(:not(pre) > code) {
		padding: 0.15rem 0.35rem;
		border-radius: 0.2rem;
		background: var(--raised);
		color: var(--ink);
	}
	.prose :global(.copy-code) {
		position: relative;
		display: grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 0.3rem;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		touch-action: manipulation;
		transition-property: color, background-color, scale;
		transition-duration: 160ms;
	}
	.prose :global(.copy-code::after) {
		position: absolute;
		inset: -0.375rem;
		content: '';
	}
	.prose :global(.copy-code:active) {
		scale: 0.96;
	}
	.prose :global(.copy-code.is-copied) {
		color: #7ee787;
	}
	.prose :global(.code-copy-status) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (hover: hover) {
		.prose :global(.copy-code:hover) {
			background: var(--raised);
			color: var(--ink);
		}
	}
	.prose :global(.token.comment),
	.prose :global(.token.prolog),
	.prose :global(.token.doctype),
	.prose :global(.token.cdata) {
		color: #6e7681;
		font-style: italic;
	}
	.prose :global(.token.keyword),
	.prose :global(.token.selector),
	.prose :global(.token.important) {
		color: #ff7b72;
		font-weight: 600;
	}
	.prose :global(.token.string),
	.prose :global(.token.char),
	.prose :global(.token.attr-value),
	.prose :global(.token.regex) {
		color: #a5d6ff;
	}
	.prose :global(.token.function),
	.prose :global(.token.class-name),
	.prose :global(.token.builtin) {
		color: #d2a8ff;
	}
	.prose :global(.token.number),
	.prose :global(.token.boolean),
	.prose :global(.token.constant),
	.prose :global(.token.symbol) {
		color: #79c0ff;
	}
	.prose :global(.token.operator),
	.prose :global(.token.punctuation) {
		color: #8b949e;
	}
	.prose :global(.token.property),
	.prose :global(.token.tag),
	.prose :global(.token.attr-name),
	.prose :global(.token.variable) {
		color: #7ee787;
	}
	.prose :global(blockquote) {
		margin: 2rem 0;
		padding-left: 1.25rem;
		border-left: 1px solid var(--line);
		color: var(--ink);
		font-family: var(--font);
		font-size: 1rem;
	}
	.prose :global(table) {
		width: 100%;
		margin: 2rem 0;
		border-collapse: collapse;
		font-size: 0.8125rem;
		line-height: 1.65;
	}
	.prose :global(thead) {
		background: var(--surface);
	}
	.prose :global(th),
	.prose :global(td) {
		padding: 0.75rem 0.85rem;
		border-bottom: 1px solid var(--line);
		text-align: left;
		vertical-align: top;
	}
	.prose :global(th) {
		color: var(--ink);
		font-weight: 600;
	}
	.prose :global(td) {
		color: var(--muted);
	}
</style>
