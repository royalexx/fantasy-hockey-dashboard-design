"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, Search, Send, X } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export interface DirectMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  isMe: boolean
}

export interface ConversationMeta {
  id: string
  managerName: string
  handle: string
  teamName: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

const initialConversations: ConversationMeta[] = [
  { id: "jordan", managerName: "Jordan", handle: "@jordan", teamName: "Toronto Titans", avatar: "JR", lastMessage: "Would you do Hutson for a 2027 1st?", timestamp: "4:15 PM", unread: true },
  { id: "alexr", managerName: "Alex R.", handle: "@alexr", teamName: "Vancouver Voyagers", avatar: "AR", lastMessage: "Makar is still available?", timestamp: "Yesterday", unread: false },
  { id: "morgan", managerName: "Morgan", handle: "@morgan", teamName: "Colorado Summit", avatar: "MO", lastMessage: "Good luck this week!", timestamp: "Mon", unread: false },
  { id: "jamie", managerName: "Jamie", handle: "@jamie", teamName: "Florida Waves", avatar: "JA", lastMessage: "I can add FAAB.", timestamp: "Sun", unread: false },
  { id: "riley", managerName: "Riley", handle: "@riley", teamName: "Detroit Motors", avatar: "RI", lastMessage: "Trade offer sent", timestamp: "Sat", unread: false },
  { id: "taylor", managerName: "Taylor", handle: "@taylor", teamName: "Boston Blades", avatar: "TA", lastMessage: "Any goalie prospects?", timestamp: "Fri", unread: false },
  { id: "priya", managerName: "Priya", handle: "@priya", teamName: "Ottawa Outlaws", avatar: "PT", lastMessage: "Shesterkin is banged up", timestamp: "Thu", unread: false },
  { id: "drew", managerName: "Drew", handle: "@drew", teamName: "Tampa Bay Bolts", avatar: "DR", lastMessage: "Let's talk picks.", timestamp: "Wed", unread: false },
  { id: "casey", managerName: "Casey", handle: "@casey", teamName: "Calgary Comets", avatar: "CS", lastMessage: "Celebrini for a winger?", timestamp: "Tue", unread: false },
  { id: "wisconsin", managerName: "WisconsinVVB", handle: "@WisconsinVVB", teamName: "Team WisconsinVVB", avatar: "WV", lastMessage: "Nice win!", timestamp: "Mon", unread: false },
  { id: "melchior", managerName: "Melchior1", handle: "@Melchior1", teamName: "Daejon Love's Team", avatar: "M1", lastMessage: "Open to offers.", timestamp: "Sep 25", unread: false },
]

const initialThreads: Record<string, DirectMessage[]> = {
  jordan: [{ id: "j1", senderId: "jordan", senderName: "Jordan", text: "Would you do Hutson for a 2027 1st?", timestamp: "4:15 PM", isMe: false }],
  alexr: [{ id: "a1", senderId: "alexr", senderName: "Alex R.", text: "Makar is still available?", timestamp: "Yesterday", isMe: false }],
  morgan: [{ id: "m1", senderId: "morgan", senderName: "Morgan", text: "Any waiver pickups you like this week?", timestamp: "Mon", isMe: false }],
}

export function DirectMessagesDialog({ open, onOpenChange, onTrade }: { open: boolean; onOpenChange: (open: boolean) => void; onTrade?: (conversation: ConversationMeta) => void }) {
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [conversations, setConversations] = useState(initialConversations)
  const [threads, setThreads] = useState(initialThreads)
  const [draft, setDraft] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const active = conversations.find((conversation) => conversation.id === activeId) ?? null
  const thread = active ? threads[active.id] ?? [] : []
  const filtered = useMemo(() => conversations.filter((item) => `${item.managerName} ${item.teamName} ${item.handle}`.toLowerCase().includes(query.toLowerCase())), [conversations, query])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [activeId, thread.length])
  const handleSendMessage = () => {
    if (!active || !draft.trim()) return
    const text = draft.trim()
    const message: DirectMessage = { id: Date.now().toString(), senderId: "you", senderName: "You", text, timestamp: "Just now", isMe: true }
    setThreads((current) => ({ ...current, [active.id]: [...(current[active.id] ?? []), message] }))
    setConversations((current) => current.map((conversation) => conversation.id === active.id ? { ...conversation, lastMessage: `You: ${text}`, timestamp: "Just now", unread: false } : conversation))
    setDraft("")
  }
  if (!open) return null
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="bottom" overlayClassName="!z-40 !bg-black/70 supports-backdrop-filter:!backdrop-blur-sm" className="!fixed !bottom-0 !left-1/2 !right-auto !top-auto !z-50 !w-full !max-w-[430px] !-translate-x-1/2 !h-[85vh] !max-h-[85vh] !flex !flex-col !gap-0 !overflow-hidden !rounded-t-3xl !border-x !border-t !border-[#1a263d] !bg-[#070a12] !p-0 !text-white !shadow-2xl">
    <div className="shrink-0 border-b border-[#1a263d] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2">{active && <button type="button" onClick={() => setActiveId(null)} aria-label="Back to direct messages"><ArrowLeft className="size-5" /></button>}<h2 className="text-lg font-black">{active ? active.handle : "Direct Messages"}</h2></div><button type="button" onClick={() => onOpenChange(false)} aria-label="Close direct messages"><X className="size-5" /></button></div>{!active && <div className="mt-3 flex items-center gap-2 rounded-full border border-[#1b2842] bg-[#0d1424] px-3 py-2"><Search className="size-4 text-[#5e7090]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search managers" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#5e7090]" /></div>}{active && <div className="mt-2 flex items-center justify-between text-[10px] text-[#6d86ab]"><span>{active.teamName}</span><button type="button" onClick={() => onTrade?.(active)} className="rounded-full bg-[#16233b] px-3 py-1 font-black text-[#19ffff]">Trade ⇄</button></div>}</div>
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">{active ? <div className="space-y-3">{thread.map((message) => <div key={message.id} className={cn("max-w-[82%] rounded-2xl px-3 py-2 text-sm", message.isMe ? "ml-auto rounded-tr-sm bg-[#0c2231] text-[#19ffff]" : "rounded-tl-sm bg-[#0d1424] text-[#cbd5e1]")}>{message.text}<small className="mt-1 block text-[9px] opacity-60">{message.timestamp}</small></div>)}<div ref={messagesEndRef} /></div> : <div className="space-y-1">{filtered.map((item) => <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#111c2e]"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#172338] text-xs font-black text-[#19ffff]">{item.avatar}</span><span className="min-w-0 flex-1"><b className="block text-sm">{item.managerName}</b><small className="text-[10px] text-[#6d86ab]">{item.handle} · {item.teamName}</small><span className="block truncate text-xs text-[#8ba0c7]">{item.lastMessage}</span></span><span className="text-[9px] text-[#5e7090]">{item.timestamp}</span>{item.unread && <i className="size-2 rounded-full bg-[#f43f5e]" />}</button>)}</div>}</div>
    {active && <form onSubmit={(event) => { event.preventDefault(); handleSendMessage() }} className="flex shrink-0 items-center gap-2 border-t border-[#141e33] p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message..." className="min-w-0 flex-1 rounded-full border border-[#1b2842] bg-[#0d1424] px-4 py-2 text-sm outline-none focus:border-[#19ffff]" /><button type="submit" aria-label="Send direct message" className="flex size-9 items-center justify-center rounded-full bg-[#19ffff] text-[#080c14]"><Send className="size-4" /></button></form>}
  </SheetContent></Sheet>
}
