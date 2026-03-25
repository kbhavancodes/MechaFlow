// app/api/spark/route.ts
// -------------------------------------------------------
// Spark Agent — API Route
// -------------------------------------------------------
// This runs SERVER-SIDE only. The Anthropic API key is
// never exposed to the browser. The response is streamed
// back as plain text so the UI can render it word by word.
// -------------------------------------------------------

import { anthropic, MODEL, SPARK_SYSTEM_PROMPT } from '@/lib/anthropic'

export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string }

  if (!prompt?.trim()) {
    return new Response('Prompt is required', { status: 400 })
  }

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system: SPARK_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
