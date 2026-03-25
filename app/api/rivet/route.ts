import { anthropic, MODEL, RIVET_SYSTEM_PROMPT } from '@/lib/anthropic'

export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string }

  if (!prompt?.trim()) {
    return new Response('Prompt is required', { status: 400 })
  }

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    system: RIVET_SYSTEM_PROMPT,
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
