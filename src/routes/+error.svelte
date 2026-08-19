<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head><title>{page.status === 404 ? 'Page not found' : 'Error'} — Ed</title></svelte:head>

<section class="page error-page">
	<p class="status">{page.status}</p>
	<h1>{page.status === 404 ? 'Nothing here.' : 'Something went wrong.'}</h1>
	<p>{page.status === 404 ? 'The page may have moved or never existed.' : page.error?.message || 'Please try again.'}</p>
	<a class="text-link" href={resolve('/')}>Back home <span class="arrow">→</span></a>
</section>

<style>
	.error-page { min-height:calc(100dvh - 13rem); display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
	.status { margin:0; color:var(--accent); font-family:var(--mono); font-size:.75rem; }
	h1 { margin:1rem 0 0; font-family:var(--font); font-size:1.75rem; font-weight:600; letter-spacing:-.03em; }
	.error-page > p:not(.status) { margin:1.5rem 0 0; color:var(--muted); }
	a { margin-top:2rem; font-size:.8rem; }
</style>
