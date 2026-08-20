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
	class="project-card group relative min-w-0 overflow-hidden rounded-2xl bg-[var(--surface)] p-1.5 text-[var(--ink)] no-underline shadow-[0_0_0_1px_rgba(255,255,255,0.08)] active:scale-[0.96] data-[variant=compact]:grid data-[variant=compact]:min-h-16 data-[variant=compact]:grid-cols-[5.5rem_minmax(0,1fr)] data-[variant=featured]:flex data-[variant=featured]:min-h-68 data-[variant=featured]:flex-col max-[42rem]:data-[variant=compact]:grid-cols-[4.75rem_minmax(0,1fr)] max-[42rem]:data-[variant=featured]:min-h-60"
	data-variant={variant}
	href={project.href}
	target="_blank"
	rel="noopener noreferrer"
>
	<div
		class="project-card__visual relative grid place-items-center overflow-hidden rounded-[0.625rem] bg-[var(--raised)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.045),transparent_48%)] after:content-[''] data-[variant=featured]:min-h-40 max-[42rem]:data-[variant=featured]:min-h-36"
		data-variant={variant}
		aria-hidden="true"
	>
		<span class="project-card__icon"><ProjectIcon kind={project.slug} compact={variant === 'compact'} /></span>
	</div>
	<div
		class="project-card__content flex min-w-0 flex-1 flex-col data-[variant=compact]:px-3 data-[variant=compact]:py-2 data-[variant=featured]:px-3.5 data-[variant=featured]:pt-4 data-[variant=featured]:pb-3.5"
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
	<span
		class="project-card__arrow absolute text-[var(--quiet)] data-[variant=compact]:top-3 data-[variant=compact]:left-18 data-[variant=featured]:top-4 data-[variant=featured]:right-4 max-[42rem]:data-[variant=compact]:left-15"
		data-variant={variant}
		aria-hidden="true"
	>
		<ArrowUpRight class="size-3.5" strokeWidth={1.5} />
	</span>
	<span class="sr-only">Opens in a new tab</span>
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
	.project-card {
		transition-property: translate, scale, box-shadow, background-color;
		transition-duration: 220ms, 140ms, 220ms, 220ms;
		transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
	}

	.project-card__visual,
	.project-card__icon,
	.project-card__content,
	.project-card__arrow {
		transition-duration: 220ms;
		transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
	}

	.project-card__visual {
		transition-property: background-color, box-shadow;
	}

	.project-card__icon {
		display: grid;
		place-items: center;
		transition-property: translate, scale;
	}

	.project-card__content,
	.project-card__arrow {
		transition-property: translate, color, opacity;
	}

	@media (hover: hover) and (pointer: fine) {
		.project-card:hover {
			translate: 0 -2px;
			background-color: color-mix(in srgb, var(--surface), white 1.5%);
			box-shadow:
				0 0 0 1px rgba(255, 255, 255, 0.14),
				0 10px 24px rgba(0, 0, 0, 0.18);
		}

		.project-card:hover .project-card__visual {
			background-color: color-mix(in srgb, var(--raised), white 2.5%);
			box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
		}

		.project-card:hover .project-card__icon {
			translate: 0 -1px;
			scale: 1.06;
		}

		.project-card:hover .project-card__content {
			translate: 2px 0;
		}

		.project-card:hover .project-card__arrow {
			translate: 2px -2px;
			color: var(--ink);
		}
	}
</style>

