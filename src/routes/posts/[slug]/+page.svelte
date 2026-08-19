<script lang="ts">
	import ListIcon from '@lucide/svelte/icons/list';
	import { copyableCode } from '$lib/actions/copyable-code';
	import { formatCalendarDate } from '$lib/utils/date';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	type Heading = { id: string; label: string; level: 2 | 3 };
	let headings = $state<Heading[]>([]);
	let activeHeading = $state('');
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
				activeHeading = current?.id ?? '';
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

<svelte:head
	><title>{data.metadata.title} — Ed</title><meta
		name="description"
		content={data.metadata.description}
	/></svelte:head
>

<article class="page w-full">
	<div class="block">
		{#if headings.length > 0}
			<aside
				class="reveal fixed top-[clamp(5.5rem,12vh,7rem)] left-[max(1.5rem,env(safe-area-inset-left))] max-h-[calc(100dvh-7rem)] w-[min(15rem,calc((100vw-42rem)/2-3.5rem))] overflow-y-auto py-1 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] max-[1120px]:hidden"
				aria-label="Table of contents"
			>
				<div
					class="mb-3 flex items-center gap-2 [font-family:var(--mono)] text-[0.6875rem] text-[var(--muted)]"
				>
					<ListIcon size={14} strokeWidth={1.75} aria-hidden="true" />
					<span>On this page</span>
				</div>
				<nav class="grid" aria-label="Article sections">
					{#each headings as heading}
						<a
							class="relative flex min-h-7 items-center py-[0.3rem] pr-3 pl-4 text-[0.75rem] leading-[1.45] [text-wrap:pretty] text-[var(--quiet)] no-underline transition-[color,transform] duration-[160ms] before:absolute before:top-2 before:bottom-2 before:left-0 before:w-px before:origin-center before:bg-[var(--line)] before:transition-[background-color,transform] before:duration-[160ms] before:content-[''] hover:translate-x-0.5 hover:text-[var(--muted)] active:scale-[0.96] data-[active=true]:text-[var(--ink)] data-[active=true]:before:scale-y-[1.35] data-[active=true]:before:bg-[var(--accent)] data-[level=3]:pl-7"
							data-active={heading.id === activeHeading}
							data-level={heading.level}
							href="#{heading.id}"
							aria-current={heading.id === activeHeading ? 'location' : undefined}
							onclick={(event) => jumpToHeading(event, heading.id)}
						>
							{heading.label}
						</a>
					{/each}
				</nav>
			</aside>
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
				<p class="mt-4 mb-0 max-w-[40rem] text-sm leading-[1.7] text-[var(--muted)]">
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
		position: relative;
		margin: 2rem 0;
	}
	.prose :global(pre) {
		overflow-x: auto;
		margin: 2rem 0;
		padding: 1.25rem 5.5rem 1.25rem 1.25rem;
		border-radius: 0.5rem;
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--line);
	}
	.prose :global(.code-frame pre) {
		margin: 0;
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
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: 0.3rem;
		background: var(--raised);
		color: var(--muted);
		cursor: pointer;
		transition-property: border-color, color, background-color, scale;
		transition-duration: 160ms;
	}
	.prose :global(.copy-code:hover) {
		border-color: #383838;
		background: #1b1b1b;
		color: var(--ink);
	}
	.prose :global(.copy-code:active) {
		scale: 0.96;
	}
	.prose :global(.copy-code.is-copied) {
		color: #7ee787;
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
		font-size: 0.875rem;
	}
</style>
