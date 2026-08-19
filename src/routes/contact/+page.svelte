<script lang="ts">
	import SeoHead from '$lib/components/seo-head.svelte';
</script>

<SeoHead
	title="Contact Ed — Software Engineer"
	description="Contact Ed by email or connect through GitHub and LinkedIn to discuss software engineering, frontend systems and product work."
	path="/contact"
/>

<div class="page">
	<header class="reveal"><h1>Contact</h1><p>The best way to reach me is by email.</p></header>
	<section class="reveal" style="--delay:80ms">
		<a class="email" href="mailto:jnralb.dev@gmail.com">jnralb.dev@gmail.com <span>↗</span></a>
		<div class="links">
			<a href="https://github.com/eddjnr/" target="_blank" rel="noopener noreferrer"
				>GitHub ↗<span class="sr-only"> (opens in a new tab)</span></a
			>
			<a
				href="https://www.linkedin.com/in/junior-albuquerque/"
				target="_blank"
				rel="noopener noreferrer"
				>LinkedIn ↗<span class="sr-only"> (opens in a new tab)</span></a
			>
		</div>
	</section>
</div>

<style>
	header h1 { margin:0; font-size:1rem; font-weight:600; }
	header p { margin:.25rem 0 0; color:var(--muted); }
	section { margin-top:3rem; }
	.email { display:flex; min-height:3rem; align-items:center; justify-content:space-between; border-block:1px solid var(--line); color:var(--ink); font-size:.875rem; text-decoration:none; transition-property:padding-inline; transition-duration:160ms; }
	.email:hover { padding-inline:.25rem; }
	.email span { color:var(--quiet); transition-property:color,transform; transition-duration:160ms; }
	.email:hover span { color:var(--ink); transform:translate(.1rem,-.1rem); }
	.links { display:flex; gap:1.25rem; margin-top:1.25rem; }
	.links a { display:inline-flex; min-height:2.75rem; align-items:center; color:var(--muted); font-size:.75rem; text-decoration:none; transition-property:color,transform; transition-duration:160ms; }
	.links a:hover { color:var(--ink); transform:translateY(-1px); }
</style>
