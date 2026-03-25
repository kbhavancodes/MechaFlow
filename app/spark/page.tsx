'use client'

import { useState } from 'react'
import Link from 'next/link'
import AgentHeader from '@/components/AgentHeader'
import PromptInput from '@/components/PromptInput'
import StreamingOutput from '@/components/StreamingOutput'

const COLOR = '#ED4F00'

export default function SparkPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim() || isLoading) return
    setOutput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/spark', {
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
        name="Spark"
        icon="🟠"
        tagline="Concept Generation"
        description="Describe your engineering problem. Get back a structured set of distinct solution concepts — conventional and unconventional."
        color={COLOR}
      />

      <PromptInput
        placeholder="Describe the engineering problem you're trying to solve..."
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Generate Concepts →"
        loadingLabel="Generating..."
        color={COLOR}
      />

      <StreamingOutput content={output} isLoading={isLoading} color={COLOR} />
    </main>
  )
}
