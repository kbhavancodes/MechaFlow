'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentId = 'spark' | 'blueprint' | 'forge' | 'rivet'

interface Message {
  id: string
  role: 'user' | 'agent'
  agentId?: AgentId
  content: string
  isStreaming?: boolean
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function HexLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2L24.39 8V20L14 26L3.61 20V8L14 2Z"
        stroke="#4A8FE8"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="14" cy="14" r="3" fill="#4A8FE8" />
    </svg>
  )
}

function SparkIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2V5M10 15V18M2 10H5M15 10H18M4.22 4.22L6.34 6.34M13.66 13.66L15.78 15.78M15.78 4.22L13.66 6.34M6.34 13.66L4.22 15.78"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2.5" fill={color} />
    </svg>
  )
}

function BlueprintIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M2 7H18M2 13H18M7 2V18M13 2V18" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  )
}

function ForgeIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 17L9 11M9 11L7 6L11 4L13 9M9 11L13 9M13 9L17 13L15 15L11 11"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RivetIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z"
        stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="10" r="2.5" stroke={color} strokeWidth="1.3" fill="none" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="#ccc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13H13" stroke="#ccc" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M15 9L3 3L6.5 9L3 15L15 9Z" fill="currentColor" />
    </svg>
  )
}

// ─── Agent Config ─────────────────────────────────────────────────────────────

const AGENTS: Record<AgentId, {
  id: AgentId
  name: string
  subtitle: string
  description: string
  color: string
  Icon: (props: { color: string; size?: number }) => JSX.Element
  placeholder: string
}> = {
  spark: {
    id: 'spark',
    name: 'Spark',
    subtitle: 'Idea generation',
    description: "Turn a raw problem into a set of viable concepts. Spark explores the solution space so you don't start from a blank page.",
    color: '#ED4F00',
    Icon: SparkIcon,
    placeholder: 'Describe your engineering problem…',
  },
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint',
    subtitle: 'Research',
    description: 'Deep dive into your chosen direction. Blueprint researches existing solutions, maps out constraints, and defines your engineering approach.',
    color: '#4A8FE8',
    Icon: BlueprintIcon,
    placeholder: 'Describe the problem and any concepts to evaluate…',
  },
  forge: {
    id: 'forge',
    name: 'Forge',
    subtitle: 'Materials/Process',
    description: 'Pick the right material and figure out how to make it. Forge recommends materials, manufacturing processes, and where to source them.',
    color: '#E05A00',
    Icon: ForgeIcon,
    placeholder: 'Describe the solution concept and any constraints…',
  },
  rivet: {
    id: 'rivet',
    name: 'Rivet',
    subtitle: 'Report Generation',
    description: 'Lock it all together. Rivet compiles everything into a clean, structured engineering report ready to share or act on.',
    color: '#3DAA5C',
    Icon: RivetIcon,
    placeholder: 'Paste your problem statement, concepts, research, and materials analysis…',
  },
}

// ─── Download helper ──────────────────────────────────────────────────────────

function downloadMarkdown(content: string, agentName: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${agentName.toLowerCase()}-output.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgentCard({
  agent,
  isActive,
  onClick,
}: {
  agent: typeof AGENTS[AgentId]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 transition-all duration-150"
      style={{
        background: '#1A1A1A',
        border: `1.5px solid ${isActive ? agent.color : 'transparent'}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <agent.Icon color={agent.color} size={18} />
        <span className="text-white text-sm font-semibold">
          {agent.name}
          <span className="text-gray-400 font-normal"> - {agent.subtitle}</span>
        </span>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed">{agent.description}</p>
    </button>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-2xl rounded-2xl px-5 py-4 text-sm text-gray-200 leading-relaxed"
        style={{ background: '#1E1E1E' }}
      >
        {content}
      </div>
    </div>
  )
}

function AgentMessage({
  message,
  agent,
}: {
  message: Message
  agent: typeof AGENTS[AgentId]
}) {
  return (
    <div className="flex justify-start">
      <div
        className="max-w-2xl w-full rounded-2xl overflow-hidden"
        style={{ background: '#1A1A1A' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <agent.Icon color={agent.color} size={16} />
            <span className="text-sm font-semibold" style={{ color: agent.color }}>
              {agent.name}:
            </span>
          </div>
          {!message.isStreaming && message.content && (
            <button
              onClick={() => downloadMarkdown(message.content, agent.name)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10"
              style={{ background: '#2A2A2A' }}
            >
              <DownloadIcon />
              Download
            </button>
          )}
        </div>
        {/* Body */}
        <div className="px-5 py-4 text-sm dark-prose">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-gray-500">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: agent.color }}
              />
              <span>Generating…</span>
            </div>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
          {message.isStreaming && message.content && (
            <span
              className="inline-block w-0.5 h-3.5 ml-0.5 align-middle animate-pulse"
              style={{ backgroundColor: agent.color }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MechaFlowApp() {
  const [activeAgent, setActiveAgent] = useState<AgentId>('spark')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }, [input])

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsgId = crypto.randomUUID()
    const agentMsgId = crypto.randomUUID()
    const agent = AGENTS[activeAgent]

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: trimmed },
      { id: agentMsgId, role: 'agent', agentId: activeAgent, content: '', isStreaming: true },
    ])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/${activeAgent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsgId ? { ...m, content: m.content + chunk } : m
          )
        )
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? { ...m, content: 'Something went wrong. Please try again.' }
            : m
        )
      )
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.id === agentMsgId ? { ...m, isStreaming: false } : m))
      )
      setIsLoading(false)
    }
  }, [input, isLoading, activeAgent])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0D0D0D' }}>
      {/* ── Left Sidebar ── */}
      <aside
        className="flex flex-col shrink-0 overflow-y-auto"
        style={{ width: 320, background: '#111111', padding: '28px 20px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <HexLogo />
          <span className="font-bold text-lg" style={{ color: '#4A8FE8' }}>
            MechaFlow
          </span>
        </div>

        {/* Agent Cards */}
        <div className="flex flex-col gap-3">
          {(Object.keys(AGENTS) as AgentId[]).map((id) => (
            <AgentCard
              key={id}
              agent={AGENTS[id]}
              isActive={activeAgent === id}
              onClick={() => setActiveAgent(id)}
            />
          ))}
        </div>
      </aside>

      {/* ── Right Chat Panel ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-4">
          {messages.length === 0 && (() => {
            const cfg = AGENTS[activeAgent]
            const EmptyIcon = cfg.Icon
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <EmptyIcon color={cfg.color} size={40} />
                  <p className="mt-4 text-gray-600 text-sm">
                    Ask <span style={{ color: cfg.color }}>{cfg.name}</span> anything…
                  </p>
                </div>
              </div>
            )
          })()}
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <UserMessage key={msg.id} content={msg.content} />
            ) : (
              <AgentMessage
                key={msg.id}
                message={msg}
                agent={AGENTS[msg.agentId ?? activeAgent]}
              />
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-10 pb-8 pt-2">
          <div
            className="flex items-end gap-3 rounded-2xl px-5 py-4"
            style={{ background: '#1A1A1A' }}
          >
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 resize-none outline-none text-sm leading-relaxed"
              style={{ minHeight: 24, maxHeight: 200 }}
              placeholder={AGENTS[activeAgent].placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all disabled:opacity-30"
              style={{
                background: AGENTS[activeAgent].color,
                color: 'white',
              }}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-center text-gray-700 text-xs">
            ⌘ + Enter to send
          </p>
        </div>
      </main>
    </div>
  )
}
