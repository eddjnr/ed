<script lang="ts">
	import '@fontsource-variable/onest/wght.css';
	import './layout.css';
	import { page } from '$app/state';

	let { children } = $props();

	const navItems = [
		{ label: 'Projects', href: '/projects' },
		{ label: 'History', href: '/history' },
		{ label: 'Writing', href: '/posts' },
		{ label: 'Contact', href: '/contact' }
	];

	function isCurrentRoute(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<svelte:head>
	<title>Ed — Software Engineer</title>
	<meta
		name="description"
		content="Ed is a software engineer working with frontend architecture, design systems and digital products."
	/>
	<meta name="theme-color" content="#0a0a0a" />
</svelte:head>

<a class="skip-link" href="#content">Skip to content</a>

<div class="site">
	<header>
		<div class="shell header-inner">
			<a class="home-link" href="/" aria-label="Ed, home">
				<img
					src="/logo.png"
					alt=""
					width="28"
					height="28"
					class="size-7 rounded-[7px] outline -outline-offset-1 outline-white/10"
				/>
			</a>
			<nav aria-label="Main navigation">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class:active={isCurrentRoute(item.href)}
						aria-current={isCurrentRoute(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main id="content" class="shell">
		{@render children()}
	</main>

	<footer>
		<div class="shell footer-inner">
			<span>Ed</span>
			<a href="mailto:jnralb.dev@gmail.com">Email ↗</a>
		</div>
	</footer>
</div>

<style>
	.site {
		display: flex;
		min-height: 100dvh;
		flex-direction: column;
	}

	main {
		display: flex;
		flex: 1;
	}

	.skip-link {
		position: fixed;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 10;
		padding: 0.5rem 0.75rem;
		background: var(--ink);
		color: var(--canvas);
		text-decoration: none;
		transform: translateY(-150%);
		transition-property: transform;
		transition-duration: 160ms;
	}

	.skip-link:focus {
		transform: translateY(0);
	}

	header {
		padding-top: 2.25rem;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.home-link {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		color: var(--ink);
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}

	nav a {
		position: relative;
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		color: var(--quiet);
		font-size: 0.75rem;
		text-decoration: none;
		transition-property: color;
		transition-duration: 160ms;
	}

	nav a::after {
		position: absolute;
		right: 0;
		bottom: 0.5rem;
		left: 0;
		height: 1px;
		content: '';
		background: var(--ink);
		transform: scaleX(0);
		transform-origin: right;
		transition-property: transform;
		transition-duration: 180ms;
	}

	nav a:hover,
	nav a.active {
		color: var(--ink);
	}

	nav a:hover::after,
	nav a.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	footer {
		border-top: 1px solid var(--line);
	}

	.footer-inner {
		display: flex;
		min-height: 6rem;
		align-items: center;
		justify-content: space-between;
		color: var(--quiet);
		font-size: 0.75rem;
	}

	.footer-inner a {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		color: var(--quiet);
		text-decoration: none;
		transition-property: color;
		transition-duration: 160ms;
	}

	.footer-inner a:hover {
		color: var(--ink);
	}

	@media (max-width: 520px) {
		header {
			padding-top: 1.25rem;
		}

		.header-inner {
			align-items: flex-start;
			flex-direction: column;
			gap: 0;
		}

		nav {
			width: 100%;
			flex-wrap: wrap;
			justify-content: space-between;
			gap: 0.5rem;
		}
	}
</style>
