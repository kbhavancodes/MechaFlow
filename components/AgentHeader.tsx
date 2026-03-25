// components/AgentHeader.tsx
// -------------------------------------------------------
// AgentHeader
// -------------------------------------------------------
// Displayed at the top of each agent page.
// Shows the agent icon, name (in brand colour),
// tagline, and a short description of what to expect.
// -------------------------------------------------------

interface AgentHeaderProps {
  name: string
  icon: string
  tagline: string
  description: string
  color: string
}

export default function AgentHeader({
  name,
  icon,
  tagline,
  description,
  color,
}: AgentHeaderProps) {
  return (
    <header className="mb-8">
      {/* Coloured left border accent */}
      <div className="flex gap-4 items-start">
        <div className="w-1 self-stretch rounded-full mt-1" style={{ backgroundColor: color }} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl" role="img" aria-label={name}>
              {icon}
            </span>
            <h1 className="text-3xl font-bold" style={{ color }}>
              {name}
            </h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
            {tagline}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </header>
  )
}
