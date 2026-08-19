<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo-head.svelte';
	import ProjectCard from '$lib/components/project-card.svelte';
	import { homeFaqs } from '$lib/data/faq';
	import { experience } from '$lib/data/history';
	import { featuredProjects } from '$lib/data/projects';
</script>

<SeoHead
	title="Ed — Frontend Software Engineer"
	description="Portfolio of Ed, a software engineer specializing in frontend architecture, design systems and thoughtful digital products."
	path="/"
	faqs={homeFaqs}
/>

<div class="page pt-[clamp(2rem,12vw,3rem)]">
	<section class="reveal" aria-labelledby="intro-title">
		<div class="max-w-[36rem]">
			<div class="flex items-center gap-4">
				<div
					class="size-14 shrink-0 overflow-hidden rounded-lg outline outline-1 -outline-offset-1 outline-white/10 transition-transform duration-[180ms] hover:-translate-y-px"
				>
					<img
						class="block size-[125%] max-w-none -translate-x-[10%] -translate-y-[4%] object-cover"
						src="/me.jpeg"
						alt="Portrait of Ed"
						width="400"
						height="400"
					/>
				</div>
				<div class="min-w-0">
					<h1
						class="m-0 text-base leading-[1.4] font-semibold tracking-[-0.015em]"
						id="intro-title"
					>
						Ed
					</h1>
					<p class="mt-[0.1rem] mb-0 text-[var(--muted)]">Software Engineer</p>
				</div>
			</div>

			<div class="mt-6 max-w-[35rem] [&_p]:mb-3 [&_p]:text-[var(--muted)] [&_p:last-child]:mb-0">
				<p>
					I’m a software engineer. I have a degree in Software Engineering and work as a Frontend
					Specialist at Conexa Saúde. My background is in frontend development, but I love
					everything around digital products — interfaces, design systems, architecture and the
					details that make software feel good to use.
				</p>
				<p>I live in Campinas, São Paulo, but I was born and raised in Parintins, Amazonas.</p>
			</div>
		</div>

		<div
			class="mt-6 grid w-full grid-cols-3 border-y border-[var(--line)] [&>a+a]:border-l [&>a+a]:border-[var(--line)]"
		>
			<a
				class="group relative flex min-h-13 min-w-0 items-center justify-center gap-2 px-2 py-3 text-[var(--muted)] no-underline transition-[color,transform,scale] duration-[160ms] ease-out hover:-translate-y-px hover:text-[var(--ink)] active:scale-[0.96]"
				href="mailto:jnralb.dev@gmail.com"
			>
				<svg
					class="size-4 shrink-0 fill-none stroke-current stroke-[1.25] text-[var(--quiet)] transition-colors duration-[180ms] ease-out [stroke-linecap:round] [stroke-linejoin:round] group-hover:text-[var(--ink)]"
					viewBox="0 0 16 16"
					aria-hidden="true"
				>
					<rect x="2" y="3.5" width="12" height="9" rx="2"></rect>
					<path d="m3 5 5 4 5-4"></path>
				</svg>
				<strong class="truncate text-xs font-semibold whitespace-nowrap">Email</strong>
			</a>
			<a
				class="group relative flex min-h-13 min-w-0 items-center justify-center gap-2 px-2 py-3 text-[var(--muted)] no-underline transition-[color,transform,scale] duration-[160ms] ease-out hover:-translate-y-px hover:text-[var(--ink)] active:scale-[0.96]"
				href="https://github.com/eddjnr/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg
					class="size-4 shrink-0 fill-current stroke-none text-[var(--quiet)] transition-colors duration-[180ms] ease-out group-hover:text-[var(--ink)]"
					viewBox="0 0 16 16"
					aria-hidden="true"
				>
					<path
						d="M8 1.5a6.5 6.5 0 0 0-2.05 12.67c.33.06.45-.14.45-.32v-1.27c-1.85.4-2.24-.78-2.24-.78-.3-.77-.74-.97-.74-.97-.6-.41.05-.4.05-.4.67.05 1.02.69 1.02.69.59 1.01 1.55.72 1.93.55.06-.43.23-.72.42-.89-1.48-.17-3.03-.74-3.03-3.29 0-.73.26-1.32.69-1.79-.07-.17-.3-.85.07-1.76 0 0 .56-.18 1.79.68A6.2 6.2 0 0 1 8 4.59c.55 0 1.1.07 1.62.22 1.23-.86 1.79-.68 1.79-.68.37.91.14 1.59.07 1.76.43.47.69 1.06.69 1.79 0 2.56-1.56 3.12-3.04 3.29.24.21.45.61.45 1.22v1.66c0 .18.12.38.46.32A6.5 6.5 0 0 0 8 1.5Z"
					></path>
				</svg>
				<strong class="truncate text-xs font-semibold whitespace-nowrap">GitHub</strong>
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
			<a
				class="group relative flex min-h-13 min-w-0 items-center justify-center gap-2 px-2 py-3 text-[var(--muted)] no-underline transition-[color,transform,scale] duration-[160ms] ease-out hover:-translate-y-px hover:text-[var(--ink)] active:scale-[0.96]"
				href="https://www.linkedin.com/in/junior-albuquerque/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg
					class="size-4 shrink-0 fill-current stroke-none text-[var(--quiet)] transition-colors duration-[180ms] ease-out group-hover:text-[var(--ink)]"
					viewBox="0 0 16 16"
					aria-hidden="true"
				>
					<rect x="2" y="6" width="2.5" height="8" rx="0.5"></rect>
					<circle cx="3.25" cy="3.25" r="1.25"></circle>
					<path
						d="M7 14V6h2.4v1.1c.6-.85 1.45-1.35 2.5-1.35 1.75 0 2.6 1.15 2.6 3.35V14H12v-4.45c0-1.1-.38-1.65-1.18-1.65-.9 0-1.32.65-1.32 1.95V14Z"
					></path>
				</svg>
				<strong class="truncate text-xs font-semibold whitespace-nowrap">LinkedIn</strong>
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
		</div>
	</section>

	<section class="reveal mt-[5.5rem]" style="--delay: 80ms" aria-labelledby="projects-title">
		<div class="mb-4">
			<h2 class="text-base font-semibold tracking-[-0.015em] text-[var(--ink)]" id="projects-title">
				Projects
			</h2>
		</div>
		<div class="grid grid-cols-1 gap-3">
			{#each featuredProjects as project (project.slug)}
				<ProjectCard {project} variant="compact" />
			{/each}
		</div>
		<a
			class="mt-2 inline-flex min-h-11 items-center text-xs text-[var(--muted)] no-underline transition-[color,transform,scale] duration-[160ms] ease-out hover:-translate-y-px hover:text-[var(--ink)] active:scale-[0.96]"
			href={resolve('/projects')}>View all projects <span aria-hidden="true">→</span></a
		>
	</section>

	<section class="reveal mt-[5.5rem]" style="--delay: 140ms" aria-labelledby="experience-title">
		<div class="mb-4">
			<h2
				class="text-base font-semibold tracking-[-0.015em] text-[var(--ink)]"
				id="experience-title"
			>
				Experience
			</h2>
		</div>
		<div class="border-t border-[var(--line)]">
			{#each experience as item, index (item.company)}
				<a
					class="group relative grid min-h-26 grid-cols-[1.5rem_minmax(0,1fr)_1rem] items-start gap-4 border-b border-[var(--line)] py-5 text-[var(--ink)] no-underline transition-transform duration-[160ms] ease-out active:scale-[0.96] max-[42rem]:min-h-0 max-[42rem]:grid-cols-[1.25rem_minmax(0,1fr)_1rem] max-[42rem]:gap-3"
					href={resolve('/about')}
				>
					<span
						class="pt-[0.15rem] [font-family:var(--mono)] text-[0.625rem] text-[var(--quiet)] tabular-nums"
						aria-hidden="true">0{index + 1}</span
					>
					<span
						class="flex min-w-0 flex-col transition-transform duration-[160ms] ease-out group-hover:translate-x-0.5"
					>
						<strong class="text-[0.8125rem] font-semibold">{item.title}</strong>
						<span class="mt-[0.1rem] flex flex-wrap gap-[0.35rem] text-xs text-[var(--quiet)]">
							<span>{item.company}</span>
							<span aria-hidden="true">·</span>
							<span class="text-xs whitespace-nowrap text-[var(--quiet)] tabular-nums"
								>{item.period}</span
							>
						</span>
						<small
							class="mt-[0.45rem] max-w-[32rem] text-[0.8125rem] leading-[1.5] [text-wrap:pretty] text-[var(--muted)]"
							>{item.homeDescription}</small
						>
					</span>
					<span
						class="pt-[0.1rem] text-xs text-[var(--quiet)] transition-[color,transform] duration-[160ms] ease-out group-hover:translate-x-[0.15rem] group-hover:text-[var(--ink)]"
						aria-hidden="true">→</span
					>
				</a>
			{/each}
		</div>
		<a
			class="mt-2 inline-flex min-h-11 items-center text-xs text-[var(--muted)] no-underline transition-[color,transform,scale] duration-[160ms] ease-out hover:-translate-y-px hover:text-[var(--ink)] active:scale-[0.96]"
			href={resolve('/about')}>More about me <span aria-hidden="true">→</span></a
		>
	</section>

	<section class="reveal mt-[5.5rem]" style="--delay: 170ms" aria-labelledby="work-title">
		<h2 class="text-base font-semibold tracking-[-0.015em] text-[var(--ink)]" id="work-title">
			What I work on
		</h2>
		<p class="mt-3 max-w-[38rem] text-[var(--muted)]">
			I turn product requirements into maintainable interfaces and frontend systems. That work
			includes deciding how an application should be structured, defining reusable UI patterns,
			connecting interfaces to reliable data flows and refining the small interactions that shape the
			overall experience. I care about making software understandable for the people using it and for
			the engineers who will maintain it later.
		</p>
		<ul class="mt-5 grid list-disc gap-3 pl-5 text-[var(--muted)] marker:text-[var(--quiet)]">
			<li>
				<strong class="text-[var(--ink)]">Frontend architecture:</strong> clear component boundaries,
				predictable state management and pragmatic technical decisions that can evolve with a product.
			</li>
			<li>
				<strong class="text-[var(--ink)]">Design systems:</strong> accessible components, consistent
				tokens and shared interaction patterns that help teams move faster without losing quality.
			</li>
			<li>
				<strong class="text-[var(--ink)]">Product engineering:</strong> collaborating across design and
				engineering to turn ambiguous problems into focused, useful software.
			</li>
			<li>
				<strong class="text-[var(--ink)]">Performance and accessibility:</strong> responsive experiences
				that load efficiently, work with assistive technology and remain usable across devices.
			</li>
		</ul>
	</section>

	<section class="reveal mt-[5.5rem]" style="--delay: 190ms" aria-labelledby="faq-title">
		<h2 class="text-base font-semibold tracking-[-0.015em] text-[var(--ink)]" id="faq-title">
			Frequently asked questions
		</h2>
		<p class="mt-3 max-w-[38rem] text-[var(--muted)]">
			A quick overview of my background, technical focus and the best way to get in touch.
		</p>
		<dl class="mt-6 border-t border-[var(--line)]">
			{#each homeFaqs as faq}
				<div class="border-b border-[var(--line)] py-5">
					<dt class="font-semibold text-[var(--ink)]">{faq.question}</dt>
					<dd class="mt-2 max-w-[38rem] text-[var(--muted)]">{faq.answer}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section
		class="reveal mt-18 border-t border-[var(--line)] pt-4"
		style="--delay: 200ms"
		aria-labelledby="contact-title"
	>
		<h2 class="m-0 text-xs font-normal text-[var(--quiet)]" id="contact-title">Contact</h2>
		<p class="mt-3 mb-0 text-[var(--muted)]">
			The best way to reach me is by
			<a class="text-[var(--ink)] underline-offset-[0.2rem]" href="mailto:jnralb.dev@gmail.com"
				>email</a
			>.
		</p>
	</section>
</div>
