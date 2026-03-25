// components/AgentCard.tsx
// -------------------------------------------------------
// AgentCard
// -------------------------------------------------------
// Used on the home page to represent each agent.
// Accepts the agent's colour, icon, name, tagline,
// description, and href (link to the agent page).
// -------------------------------------------------------

import Link from 'next/link'

interface AgentCardProps {
  name: string
  icon: string
  tagline: string
  description: string
  href: string
  color: string
}

export default function AgentCard({
  name,
  icon,
  tagline,
  description,
  href,
  color,
}: AgentCardProps) {
  return (
    <Link
      href={href}
      className="block border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      {/* Coloured top accent bar */}
      <div className="h-1 w-12 rounded-full mb-4" style={{ backgroundColor: color }} />

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" role="img" aria-label={name}>
          {icon}
        </span>
        <div>
          <p className="font-semibold text-lg leading-tight" style={{ color }}>
            {name}
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{tagline}</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

      <p className="mt-4 text-xs font-medium" style={{ color }}>
        Open {name} →
      </p>
    </Link>
  )
}
