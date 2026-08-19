---
title: The AI-Friendly Stack for Frontend and Fullstack Projects
description: A curated selection of modern technologies that work seamlessly with AI coding assistants for building production-ready applications.
date: "2026-03-28"
published: true
---

Building modern web applications in 2026 means choosing tools that not only solve technical problems but also integrate well with AI assistants. After working with various stacks, I've assembled what I consider the ideal toolkit for frontend and fullstack projects when coding with AI.

## Authentication: Better Auth

[Better Auth](https://www.better-auth.com/) is a framework-agnostic authentication library that's become my go-to choice. It's simple, secure, and AI assistants understand it well due to its clean API design.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

No more wrestling with complex auth flows. Better Auth handles sessions, OAuth, email verification, and more out of the box.

## UI Components: shadcn/ui

[shadcn/ui](https://ui.shadcn.com/) isn't a component library you install — it's a collection of reusable components you copy into your project. This approach gives you full control and makes AI modifications trivial.

```bash
npx shadcn@latest add button card form input
```

The components use Radix UI primitives and Tailwind CSS. Since the code lives in your project, AI assistants can read, understand, and modify components directly.

## Database ORM: Drizzle

[Drizzle ORM](https://orm.drizzle.team/) offers type-safe database access with a SQL-like syntax that's intuitive for both developers and AI.

```typescript
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Drizzle's schema definitions are pure TypeScript — no decorators, no magic strings. AI assistants can easily generate migrations and queries.

## Database: PostgreSQL

PostgreSQL remains the most reliable choice for production applications. It's well-documented, battle-tested, and every AI model has extensive knowledge about it.

For local development, use Docker:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

Or use services like Neon, Supabase, or Railway for managed Postgres with generous free tiers.

## Fullstack Framework: Next.js

[Next.js](https://nextjs.org/) with the App Router provides a complete fullstack solution. Server Components, API routes, and the file-based routing make it easy for AI to navigate and modify your codebase.

```typescript
// app/api/posts/route.ts
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = await db.select().from(posts);
  return NextResponse.json(allPosts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = await db.insert(posts).values(body).returning();
  return NextResponse.json(newPost[0]);
}
```

## Client-Only SPA: Vite + React

For projects that don't need SSR, [Vite](https://vitejs.dev/) with React offers the fastest development experience.

```bash
bun create vite my-app --template react-ts
```

Vite's instant HMR and minimal configuration make it perfect for dashboards, admin panels, and internal tools.

## Forms: TanStack Form

[TanStack Form](https://tanstack.com/form) brings type-safe form handling with excellent DX:

```typescript
import { useForm } from '@tanstack/react-form';

function ContactForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    },
    onSubmit: async ({ value }) => {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(value)
      });
    }
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value.includes('@') ? 'Invalid email' : undefined
        }}
      >
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
    </form>
  );
}
```

## Data Fetching: React Query

[React Query](https://tanstack.com/query) (TanStack Query) handles server state management with caching, background updates, and stale-while-revalidate patterns:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Posts() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json())
  });

  const createPost = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

## Runtime: Bun

[Bun](https://bun.sh/) is a fast JavaScript runtime that replaces Node.js, npm, and more. It's significantly faster for installing dependencies and running scripts.

```bash
# Install dependencies 10x faster
bun install

# Run TypeScript directly
bun run index.ts

# Built-in test runner
bun test
```

## Testing: Vitest

[Vitest](https://vitest.dev/) is a blazing-fast unit test framework powered by Vite. It's compatible with Jest's API but significantly faster:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Posts } from './Posts';

describe('Posts', () => {
  it('renders posts list', async () => {
    const mockPosts = [
      { id: '1', title: 'First Post' },
      { id: '2', title: 'Second Post' }
    ];

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(mockPosts)
    } as Response);

    render(<Posts />);

    expect(await screen.findByText('First Post')).toBeInTheDocument();
    expect(await screen.findByText('Second Post')).toBeInTheDocument();
  });
});
```

Vitest works seamlessly with Vite projects and supports TypeScript out of the box. The watch mode is instant thanks to Vite's hot module replacement.

## Backend Framework: Elysia

[Elysia](https://elysiajs.com/) is a Bun-first web framework with end-to-end type safety:

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/posts", async () => {
    return db.select().from(posts);
  })
  .post(
    "/posts",
    async ({ body }) => {
      return db.insert(posts).values(body).returning();
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
      }),
    },
  )
  .listen(3000);

export type App = typeof app;
```

Elysia's type inference works across client and server, making it perfect for full-type-safety applications.

---

## Bonus: AI Agent Prompt for Project Setup

Here's a prompt you can use with AI coding assistants to scaffold a project with this stack:

```
Create a new fullstack project with the following stack:

1. Initialize with Bun: `bun create vite my-app --template react-ts`
2. Add dependencies:
   - @tanstack/react-query
   - @tanstack/react-form
   - better-auth
   - drizzle-orm
   - postgres
   - tailwindcss
   - vitest @testing-library/react
   - Install shadcn/ui components: button, card, form, input

3. Set up project structure:
   /src
     /components (shadcn components)
     /lib
       db.ts (drizzle connection)
       schema.ts (drizzle schema)
       auth.ts (better-auth config)
     /hooks (react-query hooks)
     /routes

4. Configure:
   - Drizzle with PostgreSQL
   - Better Auth with email/password
   - React Query provider
   - Tailwind CSS

5. Create a basic auth flow:
   - Sign up page
   - Sign in page
   - Protected dashboard

Generate all files with proper TypeScript types.
```

This prompt gives AI assistants enough context to generate a working project structure that follows modern best practices.

---

The beauty of this stack is that each piece is well-documented, widely adopted, and AI assistants have been trained extensively on them. When you ask an AI to modify your code, it understands the patterns and can make accurate changes.

Choose tools that work with AI, not against it.
