import type { LucideIcon } from "lucide-react"

export function PlaceholderPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="mx-4 mt-4 flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-cyan-400/10">
        <Icon className="size-6 text-cyan-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  )
}
