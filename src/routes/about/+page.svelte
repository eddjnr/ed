<script lang="ts">
	import SeoHead from '$lib/components/seo-head.svelte';
	import { education, experience } from '$lib/data/history';
</script>

<SeoHead
	title="About Ed"
	description="Learn about Ed's software engineering experience, frontend specialization, education and professional credentials."
	path="/about"
/>

<div class="page">
	<header class="reveal">
		<span class="eyebrow">Career · 2019–Present</span>
		<h1 class="page-title">About</h1>
		<div class="about-intro lede">
			<p>
				Hey, I'm Ednilson. I'm a <strong>Software Engineer</strong> from Parintins, Amazonas,
				now based in Campinas, São Paulo.
			</p>
			<p>
				I started my career in software in 2019 and today I work as a
				<strong>Frontend Specialist at Conexa Saúde</strong>. My background is in frontend
				development, but I'm especially interested in everything around digital products —
				<strong>interfaces, design systems, architecture, and developer experience</strong>.
			</p>
			<p>
				I enjoy turning complex problems into software that feels
				<strong>simple, thoughtful, and enjoyable to use</strong>. Along the way, I've worked across
				frontend and full-stack development, from industrial dashboards to financial systems and
				healthcare products.
			</p>
		</div>
	</header>

	<section class="history-section reveal" style="--delay: 80ms" aria-labelledby="experience-title">
		<div class="section-heading">
			<h2 id="experience-title">Experience</h2>
			<span>03 roles</span>
		</div>
		<div class="history-list">
			{#each experience as item, index (item.company)}
				<article class="history-row">
					<span class="history-index" aria-hidden="true">0{index + 1}</span>
					<div class="history-copy">
						<strong>{item.title}</strong>
						<div class="history-meta">
							<span>{item.company}</span><span aria-hidden="true">·</span><span
								>{item.location}</span
							><span aria-hidden="true">·</span><span>{item.period}</span>
						</div>
						<p>{item.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="history-section reveal" style="--delay: 140ms" aria-labelledby="education-title">
		<div class="section-heading">
			<h2 id="education-title">Education</h2>
			<span>01 degree · 02 certificates</span>
		</div>
		<div class="history-list">
			{#each education as item (item.index)}
				<article class="history-row">
					<span class="history-index" aria-hidden="true">{item.index}</span>
					<div class="history-copy">
						<strong>{item.title}</strong>
						<div class="history-meta">
							<span>{item.organization}</span><span aria-hidden="true">·</span>
							{#if item.dateTime}
								<time datetime={item.dateTime}>{item.period}</time>
							{:else}
								<span>{item.period}</span>
							{/if}
						</div>
						{#if item.credential}
							<p class="credential">Credential ID <code>{item.credential}</code></p>
						{/if}
						{#if item.description}<p>{item.description}</p>{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	header .about-intro {
		margin: 0.75rem 0 0;
	}
	.about-intro p {
		margin: 0;
	}
	.about-intro p + p {
		margin-top: 0.75rem;
	}
	.about-intro strong {
		color: var(--ink);
		font-weight: 600;
	}
	.history-section {
		margin-top: 3.5rem;
	}
	.history-list {
		border-top: 1px solid var(--line);
	}
	.history-row {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr);
		gap: 1rem;
		padding-block: 1.5rem;
		border-bottom: 1px solid var(--line);
	}
	.history-index {
		padding-top: 0.15rem;
		color: var(--quiet);
		font-family: var(--mono);
		font-size: 0.625rem;
		font-variant-numeric: tabular-nums;
	}
	.history-copy {
		min-width: 0;
	}
	.history-copy strong {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.history-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 0.15rem;
		color: var(--quiet);
		font-size: 0.75rem;
	}
	.history-meta time {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.history-copy p {
		max-width: 34rem;
		margin: 0.65rem 0 0;
		color: var(--muted);
		font-size: 0.8125rem;
		line-height: 1.55;
		text-wrap: pretty;
	}
	.history-copy .credential {
		margin-top: 0.55rem;
		color: var(--quiet);
		font-size: 0.75rem;
	}
	.credential code {
		font-family: var(--mono);
		font-size: 0.6875rem;
		overflow-wrap: anywhere;
	}
	@media (max-width: 42rem) {
		.history-section {
			margin-top: 3rem;
		}
		.history-row {
			grid-template-columns: 1.25rem minmax(0, 1fr);
			gap: 0.75rem;
			padding-block: 1.25rem;
		}
	}
</style>
