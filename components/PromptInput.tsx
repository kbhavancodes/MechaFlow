// components/PromptInput.tsx
// -------------------------------------------------------
// PromptInput
// -------------------------------------------------------
// Shared textarea + submit button used on all agent pages.
// Accepts a placeholder, onSubmit callback, loading state,
// submit button label, and the agent's brand colour.
// -------------------------------------------------------

interface PromptInputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  submitLabel?: string
  loadingLabel?: string
  color: string
  rows?: number
}

export default function PromptInput({
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading,
  submitLabel = 'Submit →',
  loadingLabel = 'Working...',
  color,
  rows = 8,
}: PromptInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Cmd+Enter / Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div>
      <textarea
        className="w-full border border-gray-200 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 transition-shadow"
        style={
          {
            '--tw-ring-color': color,
          } as React.CSSProperties
        }
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {isLoading ? 'Streaming response...' : '⌘ + Enter to submit'}
        </p>
        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-40 transition-opacity hover:opacity-90 active:opacity-100"
          style={{ backgroundColor: color }}
        >
          {isLoading ? loadingLabel : submitLabel}
        </button>
      </div>
    </div>
  )
}
