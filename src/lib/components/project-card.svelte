<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ProjectIcon from '$lib/components/project-icon.svelte';
	import type { ProjectCardData } from '$lib/data/projects';

	let {
		project,
		variant = 'featured'
	}: { project: ProjectCardData; variant?: 'featured' | 'compact' } = $props();
</script>

<!-- Project URLs are external, so SvelteKit route resolution does not apply. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	class="group relative min-w-0 overflow-hidden rounded-2xl bg-[var(--surface)] p-1.5 text-[var(--ink)] no-underline shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow,transform,scale] duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.96] data-[variant=compact]:grid data-[variant=compact]:min-h-16 data-[variant=compact]:grid-cols-[5.5rem_minmax(0,1fr)] data-[variant=featured]:flex data-[variant=featured]:min-h-68 data-[variant=featured]:flex-col max-[42rem]:data-[variant=compact]:grid-cols-[4.75rem_minmax(0,1fr)] max-[42rem]:data-[variant=featured]:min-h-60"
	data-variant={variant}
	href={project.href}
	target="_blank"
	rel="noopener noreferrer"
>
	<div
		class="relative grid place-items-center overflow-hidden rounded-[0.625rem] bg-[var(--raised)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.045),transparent_48%)] after:content-[''] data-[variant=featured]:min-h-40 max-[42rem]:data-[variant=featured]:min-h-36"
		data-variant={variant}
		aria-hidden="true"
	>
		<ProjectIcon kind={project.slug} compact={variant === 'compact'} />
	</div>
	<div
		class="flex min-w-0 flex-1 flex-col data-[variant=compact]:px-3 data-[variant=compact]:py-2 data-[variant=featured]:px-3.5 data-[variant=featured]:pt-4 data-[variant=featured]:pb-3.5"
		data-variant={variant}
	>
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
			<strong class="text-[0.8125rem] font-semibold">{project.title}</strong>
			{#if project.year}
				<time class="text-xs text-[var(--quiet)] tabular-nums" datetime={project.year}
					>{project.year}</time
				>
			{:else if project.detail}
				<span class="text-xs text-[var(--quiet)]">{project.detail}</span>
			{/if}
		</div>
		<p
			class="mt-[0.35rem] mb-0 text-[0.8125rem] leading-[1.5] [text-wrap:pretty] text-[var(--muted)] data-[variant=compact]:mt-0.5 data-[variant=compact]:leading-[1.4]"
			data-variant={variant}
		>
			{project.description}
		</p>
		{#if project.tags}<span
				class="mt-auto pt-3 text-xs text-[var(--quiet)] data-[variant=compact]:pt-1"
				data-variant={variant}>{project.tags}</span
			>{/if}
	</div>
	<ArrowUpRight
		class="absolute size-3.5 text-[var(--quiet)] transition-[color,transform] duration-[180ms] ease-out group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] group-hover:text-[var(--ink)] data-[variant=compact]:top-3 data-[variant=compact]:left-18 data-[variant=featured]:top-4 data-[variant=featured]:right-4 max-[42rem]:data-[variant=compact]:left-15"
		data-variant={variant}
		strokeWidth={1.5}
		aria-hidden="true"
	/>
	<span class="sr-only">Opens in a new tab</span>
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->

