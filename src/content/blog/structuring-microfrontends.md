---
title: "Structuring Microfrontends: Build-Time Packages vs Runtime Federation"
description: A practical comparison of npm packages at build time and Module Federation at runtime, including deployment, rollback, resilience, and architectural trade-offs.
date: "2026-08-19"
published: true
---

<script lang="ts">
  import MicrofrontendArchitecturePlayground from "$lib/components/blog/microfrontend-architecture-playground.svelte";
</script>

Microfrontends bring the organizational ideas behind microservices to the browser. Instead of one team owning a large frontend, different teams can own complete business areas such as product discovery, checkout, billing, or account management.

The hard part is not splitting the repository. It is deciding **when and how those pieces are composed**.

There are two primary composition models:

1. npm packages for build-time composition
2. Module Federation for runtime composition

This is a direct architectural comparison: **when does the host receive and assemble the microfrontend?**.

<MicrofrontendArchitecturePlayground />

## Start with business boundaries

A microfrontend should represent a meaningful product capability. Splitting an application into `header`, `button`, and `modal` microfrontends creates network and coordination overhead without creating useful team autonomy.

A healthier e-commerce structure might look like this:

```text
storefront-shell
├── product-catalog
├── shopping-cart
├── checkout
└── customer-account
```

Each area owns its UI, data access, tests, and release decisions. A shared design system can still provide visual consistency, but it should not contain business logic.

## 1. Build-time composition with npm packages

The simplest approach is to publish each domain as a package. The shell installs those packages and imports them during its build.

```text
apps/
  storefront/
packages/
  product-catalog/
  shopping-cart/
  design-system/
```

The cart package exposes a small public API:

```tsx
// packages/shopping-cart/src/index.ts
export { ShoppingCart } from "./ShoppingCart";
export type { ShoppingCartProps } from "./types";
```

The storefront consumes it like any other dependency:

```tsx
import { ShoppingCart } from "@company/shopping-cart";

export function CartPage() {
  return <ShoppingCart customerId="customer-123" />;
}
```

Packages can live in a monorepo workspace or be published to a private registry.

### Pros

- Familiar imports, tooling, and debugging
- Excellent TypeScript support
- Easy unit and integration testing
- Works with almost every framework and bundler
- Low operational complexity

### Cons

- Integration happens at build time
- Updating a package requires rebuilding and redeploying the shell
- Teams can become tied to a shared release cycle
- Duplicate dependencies may increase bundle size

### Main challenge: package boundaries

The package should expose a small, stable contract. Importing internal files couples the host to implementation details:

```tsx
// Avoid
import { CartRow } from "@company/shopping-cart/src/internal/CartRow";

// Prefer
import { ShoppingCart } from "@company/shopping-cart";
```

npm packages are often the best starting point. They create clear boundaries without introducing runtime failure modes. If independent deployment is not a real requirement, this may be all you need.

## 2. Runtime composition with Module Federation

[Module Federation](https://module-federation.io/) allows one application to load code from another application at runtime. A host can render a checkout owned and deployed by another team without bundling that checkout into the host build.

```text
storefront.example.com
├── loads catalog.example.com/mf-manifest.json
└── loads cart.example.com/mf-manifest.json
```

This changes the deployment relationship. The remote team can publish a compatible update without rebuilding the shell.

### Exposing a remote module

Here is a simplified Webpack configuration for a shopping-cart remote using the enhanced Module Federation plugin:

```js
// shopping-cart/module-federation.config.js
module.exports = {
  name: "shopping_cart",
  exposes: {
    "./Cart": "./src/Cart.tsx",
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: "^19.0.0",
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "^19.0.0",
    },
  },
};
```

The plugin registers that configuration with Webpack:

```js
// shopping-cart/webpack.config.js
const { ModuleFederationPlugin } = require("@module-federation/enhanced/webpack");
const federationConfig = require("./module-federation.config");

module.exports = {
  output: {
    publicPath: "http://localhost:3001/",
  },
  devServer: {
    port: 3001,
  },
  plugins: [new ModuleFederationPlugin(federationConfig)],
};
```

### Registering the remote in the host

The shell gives the remote a local name and points to its manifest:

```js
// storefront/module-federation.config.js
module.exports = {
  name: "storefront",
  remotes: {
    shoppingCart: "shopping_cart@http://localhost:3001/mf-manifest.json",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};
```

The remote component can then be loaded with a dynamic import:

```tsx
import { lazy, Suspense } from "react";

const Cart = lazy(() => import("shoppingCart/Cart"));

export function CartPage() {
  return (
    <Suspense fallback={<p>Loading your cart...</p>}>
      <Cart customerId="customer-123" />
    </Suspense>
  );
}
```

The import looks local, but its implementation is downloaded from the remote deployment at runtime.

### Pros

- Teams can deploy independently
- Features can be loaded only when needed
- The host does not need to include every feature in its build
- Large dependencies can be shared between applications
- Useful for gradual migrations and multi-team platforms

### Cons

- A remote can fail after the host has already been deployed
- Version negotiation adds runtime complexity
- Local development requires coordinating multiple applications
- Types and runtime contracts can drift apart
- End-to-end debugging and observability become harder

### Challenge 1: shared dependencies

Some libraries should not have multiple instances on the same page. React is the classic example: loading incompatible copies can cause invalid hook calls and context failures.

Declaring React as a singleton asks the federation runtime to use one shared instance:

```js
shared: {
  react: {
    singleton: true,
    requiredVersion: "^19.0.0",
  },
}
```

This does not remove the need for dependency governance. Hosts and remotes still need compatible version policies and automated integration tests.

### Challenge 2: runtime availability

A federated remote is a network dependency. It may be unavailable, slow, or incompatible. The host needs a deliberate failure experience:

```tsx
<RemoteErrorBoundary fallback={<CartUnavailable />}>
  <Suspense fallback={<CartSkeleton />}>
    <Cart customerId={customerId} />
  </Suspense>
</RemoteErrorBoundary>
```

For critical flows such as checkout, decide whether to keep the last known compatible version, provide a local fallback, or temporarily block the journey. The correct strategy depends on the business impact.

### Challenge 3: contracts and types

Independent deployments require stable contracts. Props, events, routes, and shared state are all part of the remote's public API.

```ts
export interface CartProps {
  customerId: string;
  onCheckout?: (orderId: string) => void;
}
```

A small shared contract package, generated types, or consumer-driven contract tests can catch incompatible changes before production. Types help during development, but only runtime monitoring can reveal failures caused by independently deployed code.

### Challenge 4: observability

Errors and performance traces should include the host version, remote name, remote version, and manifest URL. Without this context, a production error may look as if it came from the shell even when a remote deployment caused it.

Module Federation is valuable when deployment autonomy solves a real organizational bottleneck. It is not automatically better than packages; it trades build-time coordination for runtime coordination.

## Deployment and rollback strategies

The composition model determines the release model. With packages, the host owns the final artifact. With Module Federation, the host and remote own separate artifacts that meet in the browser.

### Deploying build-time packages

A package release should be immutable. Publishing `@company/shopping-cart@4.3.1` creates an artifact that must never change. The host selects that version through `package.json` and its lockfile:

```json
{
  "dependencies": {
    "@company/shopping-cart": "4.3.1"
  }
}
```

A safe deployment pipeline usually follows this sequence:

1. Publish an immutable package version.
2. Update the dependency in the host.
3. Run contract, integration, and end-to-end tests in the host repository.
4. Build the host once.
5. Promote that same host artifact through staging and production.

The package can be released independently, but users do not receive it until the host is rebuilt and deployed. Canary or blue-green deployment therefore happens at the **host application level**, not at the package level.

### Rolling back a package

Rollback means restoring the previous package version or reverting the lockfile, then rebuilding and redeploying the host:

```diff
- "@company/shopping-cart": "4.3.2"
+ "@company/shopping-cart": "4.3.1"
```

This is slower than switching a runtime remote, but it is highly reproducible: the lockfile identifies the complete dependency graph and the failure is usually caught before the code reaches the browser.

Never overwrite or republish an existing package version. If `4.3.2` is broken, publish `4.3.3` or return the host to `4.3.1`.

### Deploying federated remotes

Federated assets should also be immutable. Instead of replacing one global `mf-manifest.json` and its chunks in place, publish every release under a versioned path:

```ts
// config/remotes.ts
export const remotes = {
  shoppingCart: "shopping_cart@https://cdn.example.com/cart/4.3.1/mf-manifest.json",
};
```

A small registry, environment configuration, or edge service can decide which version the host receives. This separates uploading an artifact from exposing it to users:

1. Build and upload the remote to a versioned, immutable URL.
2. Run smoke and contract tests against that exact manifest.
3. Expose it to internal users or a small canary cohort.
4. Observe loading errors, exceptions, and business metrics.
5. Move the production pointer to the new manifest.

Avoid changing a remote version in the middle of a user session. Resolve the version once and keep it stable for that session so navigation does not combine incompatible implementations.

### Rolling back a federated remote

If the remote contract is still compatible, rollback can be a configuration change:

```diff
- shoppingCart: https://cdn.example.com/cart/4.3.2/mf-manifest.json
+ shoppingCart: https://cdn.example.com/cart/4.3.1/mf-manifest.json
```

The host does not need to be rebuilt. The previous immutable assets are already available, so the registry or manifest pointer can return users to the last known good release.

This speed comes with conditions:

- The previous remote must remain compatible with the current host.
- Host-to-remote contracts need a backward-compatible transition window.
- APIs and data migrations must support both remote versions during rollout and rollback.
- Shared singleton dependencies must accept the versions required by both releases.
- Manifest and CDN caching must be configured so the pointer changes quickly while versioned assets remain cacheable.

If a release changes the host contract and the remote at the same time, rolling back only the remote may not recover the application. Treat cross-application breaking changes as multi-step migrations: expand the contract, deploy both sides, migrate usage, and remove the old contract later.

### Choosing a rollout pattern

| Pattern         | Build-time packages                        | Module Federation                                         |
| --------------- | ------------------------------------------ | --------------------------------------------------------- |
| All at once     | Deploy a new host artifact                 | Point all traffic to the new remote                       |
| Canary          | Send a percentage of users to the new host | Resolve a different remote manifest for a cohort          |
| Blue-green      | Keep two complete host deployments         | Keep two immutable remote versions and switch the pointer |
| Feature flag    | Activate code already bundled in the host  | Activate a remote or behavior after it loads              |
| Last known good | Redeploy the previous host artifact        | Load the previous manifest or a backup remote             |

Feature flags and retries are useful safety mechanisms, but they are not substitutes for rollback. A retry helps with a transient network failure; it does not fix a remote that consistently throws an exception. A fallback component can preserve navigation, while a version rollback restores the actual capability.

For critical remotes, keep both layers: retry transient requests through a backup CDN, then fall back to a stable local or remote implementation if loading still fails. The [Module Federation documentation](https://module-federation.io/) describes runtime retry and fallback hooks for these cases.

## Where Web Components fit

Web Components are not a third alternative to packages and Module Federation. They define how a host interacts with a piece of UI through browser standards: custom elements, attributes, properties, and events.

The same Web Component can be installed as an npm package and included at build time:

```js
import "@company/shopping-cart";
```

Or it can be exposed by a federated remote and loaded at runtime. The distribution mechanism and the UI contract are independent architectural choices.

Web Components are useful when different teams use different frameworks or when a component must run in several host environments.

A minimal cart element can be written without a framework:

```js
class ShoppingCart extends HTMLElement {
  connectedCallback() {
    const customerId = this.getAttribute("customer-id");

    this.innerHTML = `
      <section>
        <h2>Shopping cart</h2>
        <p>Customer: ${customerId}</p>
        <button type="button">Checkout</button>
      </section>
    `;

    this.querySelector("button").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("checkout", {
          detail: { customerId },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

customElements.define("shopping-cart", ShoppingCart);
```

Any host can consume it as HTML:

```html
<shopping-cart customer-id="customer-123"></shopping-cart>
```

And listen for domain events:

```js
document.querySelector("shopping-cart").addEventListener("checkout", (event) => {
  console.log("Checkout requested", event.detail);
});
```

### Pros

- Framework-independent public API
- Based on browser standards
- Can be distributed through npm, a CDN, or Module Federation
- Shadow DOM can provide style encapsulation
- Useful for incremental migrations

### Cons

- Attributes are string-based; complex data needs properties
- Shadow DOM can complicate global styling and testing
- Server rendering may require extra work
- Framework wrappers may still be needed for a polished developer experience
- Accessibility remains the component author's responsibility

### Main challenge: designing a browser-level contract

Use attributes for simple serializable configuration, properties for complex objects, and custom events for actions. CSS custom properties can provide a controlled theming surface:

```css
button {
  color: var(--cart-button-color, white);
  background: var(--cart-button-background, black);
}
```

The host can then customize the element without reaching into its internals:

```css
shopping-cart {
  --cart-button-background: royalblue;
}
```

## Build time vs runtime: the direct comparison

| Concern                | npm packages                                              | Module Federation                                         |
| ---------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Composition            | During the host build                                     | In the browser at runtime                                 |
| Version selection      | Recorded in the host lockfile                             | Negotiated when the remote loads                          |
| Deployment             | Host and package update are coordinated                   | Host and remote can deploy independently                  |
| Availability           | Required package must exist during installation and build | Remote must be reachable while the application is running |
| Failure timing         | CI, installation, or build                                | In the user's browser                                     |
| Type integration       | Direct TypeScript imports                                 | Generated or separately shared contracts                  |
| Shared dependencies    | Resolved by the package manager and bundler               | Resolved through the federation share scope               |
| Rollback               | Rebuild and redeploy the host                             | Roll back the remote independently                        |
| Operational complexity | Lower                                                     | Higher                                                    |

Web Components sit on another axis:

| Composition mechanism | Possible UI contract                                 |
| --------------------- | ---------------------------------------------------- |
| npm package           | React component, Web Component, or mounting function |
| Module Federation     | React component, Web Component, or mounting function |

This means a platform can use npm packages for design tokens and shared types, Module Federation for independently deployed domains, and Web Components at framework boundaries without treating all three as competing alternatives.

## Communication between microfrontends

Regardless of the composition mechanism, keep communication explicit and narrow:

- Props and callbacks for direct parent-child interaction
- Custom events for loosely coupled browser components
- URL state for navigation and shareable application state
- Backend APIs for durable business data

A global event bus or a shared application-wide store often recreates the coupling that microfrontends were intended to remove.

## A practical decision process

Start with four questions:

1. Do teams need to deploy independently?
2. Can the domain expose a small and stable contract?
3. What should happen when a remote is unavailable?
4. After choosing the composition model, do multiple frontend frameworks need to coexist?

If independent deployment is not required, use npm packages and keep failures in CI. If runtime autonomy is essential and the organization can support failures and version negotiation in the browser, use Module Federation. Then choose the UI contract separately; Web Components are one option when framework interoperability matters.

## Final thoughts

Microfrontends are primarily an organizational architecture. The technical boundary should reflect team ownership, release autonomy, and business domains.

npm packages offer the lowest-complexity build-time composition model. [Module Federation](https://module-federation.io/) provides runtime composition and independent deployments, but it also introduces distributed-system concerns into the frontend: availability, version compatibility, contracts, and observability. Web Components can provide a durable browser-level interface on top of either model.

Start with the simplest boundary that solves the current problem. Add runtime federation when independent deployment produces enough value to justify its operational cost.
