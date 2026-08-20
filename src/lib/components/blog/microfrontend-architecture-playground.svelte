<script lang="ts">
	import AppWindowIcon from '@lucide/svelte/icons/app-window';
	import BoxIcon from '@lucide/svelte/icons/box';
	import PackageIcon from '@lucide/svelte/icons/package';
	import RadioTowerIcon from '@lucide/svelte/icons/radio-tower';
	import ServerIcon from '@lucide/svelte/icons/server';

	type StrategyId = 'packages' | 'federation';
	type NodeIcon = 'app' | 'box' | 'package' | 'radio' | 'server';

	type Strategy = {
		id: StrategyId;
		label: string;
		title: string;
		description: string;
		composition: string;
		deployment: string;
		color: string;
		nodes: Array<{ label: string; detail: string; icon: NodeIcon }>;
	};

	const strategies: Strategy[] = [
		{
			id: 'packages',
			label: 'npm packages',
			title: 'The host assembles everything during its build',
			description:
				'Teams publish versioned packages. The host chooses a version, installs it, and ships one application bundle.',
			composition: 'Build time',
			deployment: 'Coordinated',
			color: '#f59e0b',
			nodes: [
				{ label: 'Domain package', detail: '@company/cart', icon: 'package' },
				{ label: 'Registry', detail: 'Versioned artifact', icon: 'box' },
				{ label: 'Host build', detail: 'One deployment', icon: 'app' }
			]
		},
		{
			id: 'federation',
			label: 'Module Federation',
			title: 'The host discovers and loads a remote at runtime',
			description:
				'The shell reads a remote manifest and downloads exposed modules only when the user needs them.',
			composition: 'Runtime',
			deployment: 'Independent',
			color: '#60a5fa',
			nodes: [
				{ label: 'Host shell', detail: 'storefront', icon: 'app' },
				{ label: 'Manifest', detail: 'mf-manifest.json', icon: 'radio' },
				{ label: 'Remote app', detail: 'shopping cart', icon: 'server' }
			]
		}
	];

	let activeIndex = $state(1);
	let tablist = $state<HTMLDivElement>();
	const active = $derived(strategies[activeIndex]);

	function selectStrategy(index: number) {
		activeIndex = index;
	}

	function handleTabKeydown(event: KeyboardEvent, index: number) {
		let nextIndex: number | undefined;

		if (event.key === 'ArrowRight') nextIndex = (index + 1) % strategies.length;
		if (event.key === 'ArrowLeft') nextIndex = (index - 1 + strategies.length) % strategies.length;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = strategies.length - 1;

		if (nextIndex === undefined) return;

		event.preventDefault();
		selectStrategy(nextIndex);
		tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
	}
</script>

<section class="playground" aria-labelledby="microfrontend-playground-title">
	<div class="intro">
		<div>
			<h2 id="microfrontend-playground-title">Build time or runtime?</h2>
		</div>
	</div>

	<div class="tabs" role="tablist" aria-label="Microfrontend composition timing" bind:this={tablist}>
		{#each strategies as strategy, index}
			<button
				type="button"
				role="tab"
				id="strategy-tab-{strategy.id}"
				aria-controls="strategy-panel"
				aria-selected={index === activeIndex}
				tabindex={index === activeIndex ? 0 : -1}
				onclick={() => selectStrategy(index)}
				onkeydown={(event) => handleTabKeydown(event, index)}
			>
				<span class="tab-icon" aria-hidden="true">
					{#if strategy.id === 'packages'}
						<PackageIcon size={16} strokeWidth={1.8} />
					{:else}
						<RadioTowerIcon size={16} strokeWidth={1.8} />
					{/if}
				</span>
				<span>{strategy.label}</span>
			</button>
		{/each}
	</div>

	<div
		class="panel"
		role="tabpanel"
		id="strategy-panel"
		aria-labelledby="strategy-tab-{active.id}"
		style={`--strategy: ${active.color}`}
	>
		{#key active.id}
			<div class="panel-copy">
				<p class="mode-title">{active.title}</p>
				<p class="description">{active.description}</p>
			</div>

			<div class="stage">
				<div class="flow-map">
					<div class="route" aria-hidden="true"><span></span></div>
					<ol class="flow" aria-label={`${active.label} composition flow`}>
						{#each active.nodes as node, index}
							<li style={`--node-delay: ${index * 70}ms`}>
								<span class="node-icon" aria-hidden="true">
									{#if node.icon === 'app'}
										<AppWindowIcon size={21} strokeWidth={1.7} />
									{:else if node.icon === 'box'}
										<BoxIcon size={21} strokeWidth={1.7} />
									{:else if node.icon === 'package'}
										<PackageIcon size={21} strokeWidth={1.7} />
									{:else if node.icon === 'radio'}
										<RadioTowerIcon size={21} strokeWidth={1.7} />
									{:else}
										<ServerIcon size={21} strokeWidth={1.7} />
									{/if}
								</span>
								<strong>{node.label}</strong>
								<small>{node.detail}</small>
							</li>
						{/each}
					</ol>
				</div>
			</div>

			<dl class="facts">
				<div>
					<dt>Composition</dt>
					<dd>{active.composition}</dd>
				</div>
				<div>
					<dt>Deployments</dt>
					<dd>{active.deployment}</dd>
				</div>
			</dl>
		{/key}
	</div>
</section>

<style>
	.playground {
		margin: 2.5rem 0 3.5rem;
		color: var(--muted);
	}

	.playground h2,
	.playground p,
	.playground ol,
	.playground dl,
	.playground dd {
		margin: 0;
	}

	.intro {
		margin-bottom: 1rem;
	}

	.intro h2 {
		margin-top: 0.35rem;
		color: var(--ink);
		font-family: var(--font);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.4;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.35rem;
		margin-bottom: 0.5rem;
		padding: 0.3rem;
		border-radius: 0.55rem;
		background: var(--surface);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.tabs button {
		display: flex;
		min-width: 0;
		min-height: 2.75rem;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.55rem 0.7rem;
		border: 0;
		border-radius: 0.25rem;
		background: transparent;
		color: var(--quiet);
		font: 500 0.75rem/1.25 var(--font);
		cursor: pointer;
		touch-action: manipulation;
		transition-property: color, background-color, box-shadow, scale;
		transition-duration: 160ms;
		transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
	}

	.tabs button[aria-selected='true'] {
		background: var(--raised);
		color: var(--ink);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.09), 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.tabs button:active {
		scale: 0.96;
	}

	.tab-icon {
		display: grid;
		flex: none;
		place-items: center;
	}

	.panel {
		min-height: 25rem;
		padding: clamp(1.25rem, 4vw, 2rem);
		border-radius: 0.5rem;
		background: #0d0d0d;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.09);
		overflow: hidden;
	}

	.panel-copy {
		max-width: 34rem;
	}

	.mode-title {
		color: var(--ink);
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.5;
		text-wrap: balance;
	}

	.playground .description {
		margin-top: 0.45rem;
		color: var(--muted);
		font-size: 0.8125rem;
		line-height: 1.65;
		text-wrap: pretty;
	}

	.stage {
		display: grid;
		min-height: 13.5rem;
		place-items: center;
		margin: 1.25rem 0;
		padding: 1rem 0;
	}

	.flow-map {
		position: relative;
		width: 100%;
	}

	.flow {
		position: relative;
		z-index: 1;
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(0.5rem, 3vw, 1.25rem);
		padding: 0;
		list-style: none;
	}

	.flow li {
		display: grid;
		min-width: 0;
		justify-items: center;
		text-align: center;
	}

	.node-icon {
		display: grid;
		width: 3.25rem;
		height: 3.25rem;
		place-items: center;
		border-radius: 50%;
		background: color-mix(in srgb, var(--strategy) 16%, #101010);
		color: var(--strategy);
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--strategy) 35%, transparent),
			0 0 0 0.35rem #0d0d0d;
	}

	.flow strong,
	.flow small {
		display: block;
		max-width: 9rem;
	}

	.flow strong {
		margin-top: 0.75rem;
		color: var(--ink);
		font-size: 0.75rem;
		font-weight: 550;
		line-height: 1.35;
	}

	.flow small {
		margin-top: 0.2rem;
		color: var(--quiet);
		font-family: var(--mono);
		font-size: 0.625rem;
		line-height: 1.4;
		word-break: break-word;
	}

	.route {
		position: absolute;
		top: 1.625rem;
		left: 16.666%;
		width: 66.666%;
		border-top: 1px dashed #343434;
	}

	.route span {
		position: absolute;
		top: -0.25rem;
		left: -0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--strategy);
		box-shadow: 0 0 0.75rem color-mix(in srgb, var(--strategy) 55%, transparent);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-top: 1px solid var(--line);
	}

	.facts div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 0.85rem;
	}

	.facts div + div {
		margin-left: 1.25rem;
		padding-left: 1.25rem;
		border-left: 1px solid var(--line);
	}

	.facts dt,
	.facts dd {
		font-size: 0.6875rem;
		line-height: 1.4;
	}

	.facts dt {
		color: var(--quiet);
	}

	.facts dd {
		color: var(--strategy);
		font-family: var(--mono);
	}

	@media (hover: hover) {
		.tabs button:hover:not([aria-selected='true']) {
			background: color-mix(in srgb, var(--raised) 60%, transparent);
			color: var(--muted);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.panel-copy,
		.facts {
			animation: reveal-copy 260ms cubic-bezier(0.2, 0, 0, 1) both;
		}

		.flow li {
			animation: reveal-node 300ms cubic-bezier(0.2, 0, 0, 1) both;
			animation-delay: var(--node-delay);
		}

		.route span {
			animation: travel 700ms cubic-bezier(0.4, 0, 0.2, 1) both;
		}
	}

	@keyframes reveal-copy {
		from {
			opacity: 0;
			transform: translateY(0.35rem);
		}
	}

	@keyframes reveal-node {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
			filter: blur(4px);
		}
	}

	@keyframes travel {
		from {
			left: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		to {
			left: 100%;
			opacity: 0;
		}
	}

	@media (max-width: 34rem) {
		.tabs button {
			flex-direction: column;
			gap: 0.25rem;
			padding-inline: 0.3rem;
			font-size: 0.6875rem;
		}

		.panel {
			min-height: 34rem;
		}

		.stage {
			min-height: 23rem;
		}

		.flow {
			width: min(100%, 15rem);
			grid-template-columns: 1fr;
			gap: 1.35rem;
			margin-inline: auto;
		}

		.flow li {
			grid-template-columns: 3.25rem minmax(0, 1fr);
			grid-template-rows: auto auto;
			column-gap: 0.9rem;
			justify-items: start;
			text-align: left;
		}

		.node-icon {
			grid-row: 1 / 3;
		}

		.flow strong {
			align-self: end;
			margin-top: 0;
		}

		.flow small {
			align-self: start;
		}

		.route {
			top: 1.625rem;
			bottom: 1.625rem;
			left: calc(50% - min(50%, 7.5rem) + 1.625rem);
			width: 0;
			border-top: 0;
			border-left: 1px dashed #343434;
		}

		.route span {
			display: none;
		}

		.facts {
			grid-template-columns: 1fr;
		}

		.facts div + div {
			margin: 0.75rem 0 0;
			padding: 0.75rem 0 0;
			border-top: 1px solid var(--line);
			border-left: 0;
		}
	}
</style>
