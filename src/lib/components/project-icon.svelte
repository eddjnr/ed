<script lang="ts">
	let { kind, compact = false }: { kind: string; compact?: boolean } = $props();
</script>

<svg
	class="size-16 text-[var(--muted)] data-[compact=true]:size-11"
	data-compact={compact}
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
>
	{#if kind === 'kasho'}
		<rect class="fill-[#595959] opacity-45" x="19" y="17" width="20" height="30" rx="4" transform="rotate(-4 19 17)" />
		<rect class="fill-[#747474]" x="23" y="14" width="20" height="30" rx="4" />
		<rect class="fill-[#4a4a4a]" x="30" y="19" width="20" height="30" rx="4" transform="rotate(4 30 19)" />
	{:else if kind === 'aeronotch'}
		<ellipse class="stroke-white/50" cx="32" cy="32" rx="21" ry="8" />
		<ellipse class="stroke-white/50" cx="32" cy="32" rx="21" ry="8" transform="rotate(60 32 32)" />
		<ellipse class="stroke-white/50" cx="32" cy="32" rx="21" ry="8" transform="rotate(120 32 32)" />
	{:else if kind === 'dailo'}
		<rect class="fill-[#565656]" x="19" y="20" width="26" height="6" rx="3" />
		<rect class="fill-[#777]" x="12" y="29" width="40" height="6" rx="3" />
		<rect class="fill-[#565656]" x="16" y="38" width="33" height="6" rx="3" />
	{:else if kind === 'dot-wars'}
		<circle class="fill-[#d4d4d4]" cx="19" cy="28" r="7" />
		<circle class="fill-[#757575]" cx="44" cy="24" r="5" />
		<circle class="fill-[#555]" cx="34" cy="44" r="4" />
	{:else}
		<rect class="fill-[#707070]" x="14" y="36" width="9" height="9" rx="2" />
		<rect class="fill-[#a0a0a0]" x="28" y="16" width="9" height="9" rx="2" />
		<rect class="fill-[#505050]" x="43" y="36" width="9" height="9" rx="2" />
		<path class="stroke-white/20" d="M22 36 30 25M36 25l9 11M23 40h20" />
	{/if}
</svg>
