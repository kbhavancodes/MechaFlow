'use client'

import { useState } from 'react'
import Link from 'next/link'
import AgentHeader from '@/components/AgentHeader'
import PromptInput from '@/components/PromptInput'
import StreamingOutput from '@/components/StreamingOutput'

const COLOR = '#13601B'

export default function RivetPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim() || isLoading) return
    setOutput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/rivet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput((prev) => prev + decoder.decode(value))
      }
    } catch {
      setOutput('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Back
      </Link>

      <AgentHeader
        name="Rivet"
        icon="🟢"
        tagline="Report Writing"
        description="Paste in any combination of problem statement, concept descriptions, research notes, and materials analysis. Get a complete professional engineering report."
        color={COLOR}
      />

      <PromptInput
        placeholder="Paste your problem statement, concept descriptions, research notes, and/or materials analysis here..."
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Write Report →"
        loadingLabel="Writing..."
        color={COLOR}
        rows={12}
      />

      <StreamingOutput content={output} isLoading={isLoading} color={COLOR} />
    </main>
  )
}
