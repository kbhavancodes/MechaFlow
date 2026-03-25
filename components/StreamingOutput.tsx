// components/StreamingOutput.tsx
// -------------------------------------------------------
// StreamingOutput
// -------------------------------------------------------
// Renders the streamed markdown text returned by Claude.
//
// Why render as markdown?
// Claude returns well-structured markdown with headers,
// lists, and bold text. Rendering it as markdown makes
// the output readable and professional without extra work.
//
// Uses `react-markdown` for safe markdown rendering.
// Install: npm install react-markdown
// -------------------------------------------------------

import ReactMarkdown from 'react-markdown'

interface StreamingOutputProps {
  content: string
  isLoading: boolean
  color?: string
}

export default function StreamingOutput({
  content,
  isLoading,
  color = '#111111',
}: StreamingOutputProps) {
  if (!content && !isLoading) return null

  return (
    <div className="mt-8">
      {/* Coloured divider */}
      <div className="h-px w-full bg-gray-100 mb-6" />

      {isLoading && !content && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {/* Animated pulse dots */}
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          <span>Generating...</span>
        </div>
      )}

      {content && (
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown>{content}</ReactMarkdown>
          {/* Blinking cursor while still streaming */}
          {isLoading && (
            <span
              className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
      )}
    </div>
  )
}
