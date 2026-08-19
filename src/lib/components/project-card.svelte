<script lang="ts">
	import type { ProjectCardData } from '$lib/data/projects';

	let {
		project,
		variant = 'featured'
	}: { project: ProjectCardData; variant?: 'featured' | 'compact' } = $props();
</script>

<a
	class="group relative min-w-0 overflow-hidden rounded-2xl bg-[var(--surface)] p-1.5 text-[var(--ink)] no-underline shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow,transform,scale] duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.96] data-[variant=compact]:grid data-[variant=compact]:min-h-18 data-[variant=compact]:grid-cols-[5.5rem_minmax(0,1fr)] data-[variant=featured]:flex data-[variant=featured]:min-h-68 data-[variant=featured]:flex-col max-[42rem]:data-[variant=compact]:grid-cols-[4.75rem_minmax(0,1fr)] max-[42rem]:data-[variant=featured]:min-h-60"
	data-variant={variant}
	href={project.href}
	target="_blank"
	rel="noopener noreferrer"
>
	<div
		class="project-preview project-preview--{project.slug} relative grid place-items-center overflow-hidden rounded-[0.625rem] bg-[var(--raised)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.045),transparent_48%)] after:content-[''] data-[variant=featured]:min-h-40 max-[42rem]:data-[variant=featured]:min-h-36 [&>span]:absolute [&>span]:block data-[variant=compact]:[&>span]:scale-[0.68]"
		data-variant={variant}
		aria-hidden="true"
	>
		<span></span><span></span><span></span>
	</div>
	<div
		class="flex min-w-0 flex-1 flex-col data-[variant=compact]:px-3 data-[variant=compact]:pt-3.5 data-[variant=compact]:pb-3 data-[variant=featured]:px-3.5 data-[variant=featured]:pt-4 data-[variant=featured]:pb-3.5"
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
			class="mt-[0.35rem] mb-0 text-[0.8125rem] leading-[1.5] [text-wrap:pretty] text-[var(--muted)]"
		>
			{project.description}
		</p>
		{#if project.tags}<span class="mt-auto pt-3 text-xs text-[var(--quiet)]">{project.tags}</span
			>{/if}
	</div>
	<span
		class="absolute text-[0.8125rem] text-[var(--quiet)] transition-[color,transform] duration-[180ms] ease-out group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] group-hover:text-[var(--ink)] data-[variant=compact]:top-3 data-[variant=compact]:left-18 data-[variant=featured]:top-4 data-[variant=featured]:right-4 max-[42rem]:data-[variant=compact]:left-15"
		data-variant={variant}
		aria-hidden="true">↗</span
	>
	<span class="sr-only">Opens in a new tab</span>
</a>

<style>
	.project-preview--kasho span {
		width: 2rem;
		height: 2.75rem;
		border-radius: 0.375rem;
		background: #595959;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
	}

	.project-preview--kasho span:nth-child(1) {
		transform: translateX(-0.75rem) rotate(-4deg);
		opacity: 0.45;
	}

	.project-preview--kasho span:nth-child(2) {
		transform: translateY(-0.25rem);
		background: #747474;
	}

	.project-preview--kasho span:nth-child(3) {
		transform: translate(0.75rem, 0.2rem) rotate(4deg);
		background: #4a4a4a;
	}

	.project-preview--aeronotch span {
		width: 3rem;
		height: 1.25rem;
		border: 1px solid rgba(255, 255, 255, 0.48);
		border-radius: 999px;
	}

	.project-preview--aeronotch span:nth-child(2) {
		transform: rotate(60deg);
	}
	.project-preview--aeronotch span:nth-child(3) {
		transform: rotate(120deg);
	}

	.project-preview--dailo span {
		left: calc(50% - 2rem);
		width: 4rem;
		height: 0.5rem;
		border-radius: 999px;
		background: #565656;
	}

	.project-preview--dailo span:nth-child(1) {
		top: calc(50% - 1.25rem);
		width: 2.5rem;
	}
	.project-preview--dailo span:nth-child(2) {
		top: calc(50% - 0.25rem);
		background: #777;
	}
	.project-preview--dailo span:nth-child(3) {
		top: calc(50% + 0.75rem);
		width: 3.25rem;
	}

	.project-preview--dot-wars span {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #d4d4d4;
		box-shadow: 0 0 0 0.375rem rgba(255, 255, 255, 0.05);
	}

	.project-preview--dot-wars span:nth-child(1) {
		transform: translate(-1.75rem, -0.6rem);
	}
	.project-preview--dot-wars span:nth-child(2) {
		transform: translate(1.6rem, -0.9rem) scale(0.7);
		background: #757575;
	}
	.project-preview--dot-wars span:nth-child(3) {
		transform: translate(0.25rem, 1.25rem) scale(0.5);
		background: #555;
	}

	.project-preview--rst-iot span {
		width: 0.875rem;
		height: 0.875rem;
		border-radius: 0.2rem;
		background: #707070;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.project-preview--rst-iot span:nth-child(1) {
		transform: translate(-1.5rem, 0.75rem);
	}
	.project-preview--rst-iot span:nth-child(2) {
		transform: translateY(-1rem);
		background: #a0a0a0;
	}
	.project-preview--rst-iot span:nth-child(3) {
		transform: translate(1.5rem, 0.75rem);
		background: #505050;
	}
</style>
