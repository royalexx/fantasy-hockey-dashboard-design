"use client"

import { useEffect, useRef, useState } from "react"
import { Send, X, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { chatMessages as initialMessages, type ChatMessage } from "@/lib/hockey-data"

export function LeagueChatDrawer({ open, onOpenChange, onLatestMessage, latestPreview }: { open: boolean; onOpenChange: (open: boolean) => void; onLatestMessage?: (message: string) => void; latestPreview?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState("")
  const feedRef = useRef<HTMLDivElement>(null)
  const latest = messages[messages.length - 1]
  useEffect(() => { if (open && feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight }, [open, messages])
  const send = () => {
    if (!draft.trim()) return
    const message: ChatMessage = { id: `chat-${Date.now()}`, author: "You", avatarInitials: "YO", message: draft.trim(), time: "Now" }
    setMessages((current) => [...current, message])
    onLatestMessage?.(message.message)
    setDraft("")
  }
  if (!open) {
    return <button type="button" onClick={() => onOpenChange(true)} aria-label="Open league chat" className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 cursor-pointer border-t border-[#1a263d] bg-[#0d1424]/95 px-4 py-2.5 backdrop-blur transition-all active:opacity-80"><div className="mx-auto flex items-center gap-2.5"><div className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-red-500" /><span className="text-xs font-bold text-white">Chat</span></div><p className="min-w-0 flex-1 truncate text-left text-xs text-[#6e81a3]"><span className="font-medium text-[#cbd5e1]">{latestPreview ?? `${latest.author}:`}</span>{latestPreview ? "" : ` ${latest.message}`}</p><span className="text-xs text-[#5e7090]">▲</span></div></button>
  }
  return <>
    <button type="button" onClick={() => onOpenChange(true)} aria-label="Open league chat" aria-hidden={open} className={`fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 cursor-pointer border-t border-[#1a263d] bg-[#0d1424]/95 px-4 py-2.5 backdrop-blur transition-all active:opacity-80 ${open ? "pointer-events-none translate-y-full" : ""}`}>
      <div className="mx-auto flex items-center gap-2.5"><div className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-red-500" /><span className="text-xs font-bold text-white">Chat</span></div><p className="min-w-0 flex-1 truncate text-left text-xs text-[#6e81a3]"><span className="font-medium text-[#cbd5e1]">{latestPreview ?? `${latest.author}:`}</span>{latestPreview ? "" : ` ${latest.message}`}</p><span className="text-xs text-[#5e7090]">▲</span></div>
    </button>
    <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="bottom" overlayClassName="!z-40 !bg-black/70 supports-backdrop-filter:!backdrop-blur-sm" className="!fixed !bottom-0 !left-1/2 !right-auto !top-auto !z-50 !w-full !max-w-[430px] !-translate-x-1/2 !h-[85vh] !max-h-[85vh] !flex !flex-col !gap-0 !overflow-hidden !rounded-t-3xl !border-x !border-t !border-[#1a263d] !bg-[#070a12] !p-0 !text-white !shadow-2xl">
      <SheetHeader className="shrink-0 flex-row items-center justify-between border-b border-[#141e33] p-4"><SheetTitle className="text-sm font-black"># general-chat <span className="ml-2 text-[10px] font-normal text-[#6d86ab]">12 members • 5 online</span></SheetTitle><button type="button" onClick={() => onOpenChange(false)} aria-label="Close league chat"><X className="size-5 text-[#8ba0c7]" /></button></SheetHeader>
      <div ref={feedRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-4 p-4">{messages.map((msg) => msg.system ? <div key={msg.id} className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2"><Zap className="size-4 text-amber-400" /><p className="text-xs font-medium text-amber-300">{msg.message}</p></div> : <div key={msg.id} className="flex items-start gap-2.5"><Avatar className="size-8 shrink-0 border border-zinc-700"><AvatarFallback className="bg-[#172338] text-[11px] text-[#19ffff]">{msg.avatarInitials}</AvatarFallback></Avatar><div className="min-w-0"><div className="flex items-baseline gap-2"><p className="text-xs font-semibold">{msg.author}</p><p className="text-[11px] text-[#5e7090]">{msg.time}</p></div><p className="mt-0.5 rounded-2xl rounded-tl-sm bg-[#0d1424] px-3 py-2 text-sm text-[#cbd5e1]">{msg.message}</p></div></div>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); send() }} className="flex shrink-0 items-center gap-2 border-t border-[#141e33] bg-[#070a12] p-3"><span className="text-lg">😊</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Send a message..." className="min-w-0 flex-1 rounded-full border border-[#1b2842] bg-[#0d1424] px-4 py-2 text-sm text-white outline-none placeholder:text-[#5e7090] focus:border-[#19ffff]" /><button type="submit" aria-label="Send message" className="flex size-9 items-center justify-center rounded-full bg-[#19ffff] text-[#080c14]"><Send className="size-4" /></button></form>
    </SheetContent></Sheet>
  </>
}
