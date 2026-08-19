<script lang="ts">
	import SeoHead from '$lib/components/seo-head.svelte';
	import ProjectCard from '$lib/components/project-card.svelte';
	import { projects } from '$lib/data/projects';
</script>

<SeoHead
	title="Software Projects by Ed"
	description="Explore Ed's selected software projects across personal finance, Windows utilities, productivity, realtime applications and IoT research."
	path="/projects"
/>

<div class="page">
	<header class="reveal">
		<span class="eyebrow">Portfolio · 05 projects</span>
		<h1 class="page-title">Projects</h1>
		<p class="lede">Selected product work, experiments and research across the web and desktop.</p>
	</header>

	<section class="project-grid reveal" style="--delay: 80ms" aria-label="Projects">
		{#each projects as project (project.slug)}
			<ProjectCard {project} variant="compact" />
		{/each}
	</section>
</div>

<style>
	header .lede {
		margin: 0.75rem 0 0;
	}

	.project-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		margin-top: 3rem;
	}
</style>
