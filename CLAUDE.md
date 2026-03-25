# MechaFlow — Claude Code Context

This file gives Claude Code the full picture of this project so every session starts with the right context. Read this before making any changes.

---

## What This App Does

MechaFlow is a Next.js web app with 4 independent AI agents that help mechanical engineers move from problem statement to finished report faster. Each agent calls the Claude API server-side and streams the response back to the browser.

---

## Tech Stack

| Tool | Version | Why |
|---|---|---|
| Next.js (App Router) | 14+ | Vercel deployment, built-in API routes, server-side API calls |
| TypeScript | 5+ | Type safety for AI-generated code |
| Tailwind CSS | 3+ | Fast utility-first styling |
| `@anthropic-ai/sdk` | latest | Official Anthropic client |

---

## The 4 Agents

Each agent has:
- A page at `app/{agent}/page.tsx` — the UI
- An API route at `app/api/{agent}/route.ts` — the Claude call
- A system prompt in `lib/anthropic.ts`

| Agent | Route | Color | Job |
|---|---|---|---|
| 🟠 Spark | `/spark` | `#ED4F00` | Generates multiple solution concepts from a problem description |
| 🔵 Blueprint | `/blueprint` | `#0046B6` | Research, standards, feasibility analysis, open questions |
| 🔴 Forge | `/forge` | `#AD0000` | Materials selection, manufacturing process, tolerances, failure modes |
| 🟢 Rivet | `/rivet` | `#13601B` | Writes the final structured engineering report |

---

## System Prompts

These live in `lib/anthropic.ts`. Tune these to change agent behaviour.

### 🟠 Spark System Prompt
```
You are Spark, an engineering concept generation agent. Your job is to take a mechanical engineering problem description and return a structured set of distinct solution concepts.

Rules:
- Return 3–5 solution concepts
- Include both conventional and unconventional approaches
- Each concept should have: a name, a 2–3 sentence description, and key trade-offs
- Write precisely enough that an engineer could sketch the concept or take it to CAD
- Do not recommend one concept over another — that is the engineer's job
- Format output in clean Markdown with headers for each concept
```

### 🔵 Blueprint System Prompt
```
You are Blueprint, an engineering research and feasibility agent. Your job is to map the problem space before the engineer commits to a direction.

Rules:
- Identify relevant engineering standards, constraints, and prior art
- Rate feasibility of any proposed solution concepts (if provided) on a scale: High / Medium / Low / Unknown
- Explicitly flag gaps, unknowns, and assumptions — do not paper over uncertainty
- List open questions the engineer must resolve before proceeding
- Format output in clean Markdown: Problem Analysis, Feasibility Ratings, Open Questions
```

### 🔴 Forge System Prompt
```
You are Forge, an engineering materials and manufacturing agent. Given a solution concept, determine what it is made of and how it gets built.

Rules:
- Ask whether the context is prototype or production (if not stated, address both)
- Return ranked material options with pros/cons and typical specs
- Recommend manufacturing processes appropriate to quantity and complexity
- Include relevant tolerances and surface finish requirements
- List likely failure modes and what to watch for in testing
- Format output in clean Markdown: Materials, Manufacturing, Tolerances, Failure Modes
```

### 🟢 Rivet System Prompt
```
You are Rivet, an engineering report writing agent. You synthesise inputs from the design process into a complete, professional engineering report.

Rules:
- Accept inputs in any combination: problem statement, concept descriptions, research notes, materials analysis
- Write in clear, professional engineering language — no filler, no hedging
- Structure: Executive Summary, Problem Definition, Proposed Solutions, Feasibility Analysis, Materials & Manufacturing, Recommendations, Open Items
- Flag anything that was not provided as input as [NOT PROVIDED — TO BE COMPLETED]
- Format output in clean Markdown suitable for conversion to a PDF or Word document
```

---

## File Conventions

- **Pages** (`app/*/page.tsx`): Client components (`'use client'`). Handle form state, call the API route, render streamed output.
- **API Routes** (`app/api/*/route.ts`): Server-side only. Import Anthropic client. Never expose `ANTHROPIC_API_KEY` to the browser.
- **Components** (`components/`): Reusable UI. Keep them dumb — pass data via props.
- **`lib/anthropic.ts`**: Anthropic client singleton. All system prompts live here.

---

## Streaming Pattern

API routes return a `ReadableStream`. Pages read it with `fetch()` and update state as chunks arrive.

```typescript
// app/api/spark/route.ts — pattern to follow for all agents
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SPARK_SYSTEM_PROMPT, // from lib/anthropic.ts
    messages: [{ role: 'user', content: prompt }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

```typescript
// app/spark/page.tsx — client-side streaming read pattern
const response = await fetch('/api/spark', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: userInput }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  setOutput(prev => prev + decoder.decode(value));
}
```

---

## Shared Components

### `PromptInput`
Props: `placeholder`, `onSubmit(value: string)`, `isLoading`
Renders a `<textarea>` and submit button. Used on all 4 agent pages.

### `StreamingOutput`
Props: `content: string`, `isLoading: boolean`
Renders markdown output from Claude. Use a markdown renderer like `react-markdown`.

### `AgentCard`
Props: `name`, `color`, `icon`, `description`, `href`
Used on the home page to link to each agent.

### `AgentHeader`
Props: `name`, `color`, `icon`, `tagline`
Used at the top of each agent page.

---

## What's Not Built Yet

When starting a session, check this list and pick up where you left off:

- [ ] Home page (`app/page.tsx`) with agent cards
- [ ] Spark page + API route
- [ ] Blueprint page + API route
- [ ] Forge page + API route
- [ ] Rivet page + API route
- [ ] `lib/anthropic.ts` with client + system prompts
- [ ] Shared components (PromptInput, StreamingOutput, AgentCard, AgentHeader)
- [ ] Global layout and nav (`app/layout.tsx`)
- [ ] Tailwind config + CSS variables for agent colours
- [ ] `.env.local.example`
- [ ] Vercel deployment

---

## Agent Colours (CSS Variables)

Define these in `globals.css` or `tailwind.config.ts`:

```css
:root {
  --spark:     #ED4F00;
  --blueprint: #0046B6;
  --forge:     #AD0000;
  --rivet:     #13601B;
}
```

---

## Model to Use

Always use `claude-sonnet-4-20250514` unless otherwise specified. Do not use Haiku (too weak for engineering reasoning) or Opus (too slow for streaming UX).

---

## Do Not

- Do not put `ANTHROPIC_API_KEY` in client-side code
- Do not use `pages/` router — this project uses App Router only
- Do not skip TypeScript types — always type props, API request bodies, and response shapes
- Do not use `any` types
