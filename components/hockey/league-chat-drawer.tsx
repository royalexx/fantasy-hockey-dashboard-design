"use client"

import { MessageCircle, Send, Zap } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { chatMessages } from "@/lib/hockey-data"

export function LeagueChatDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        aria-label="Open league chat"
        className="fixed bottom-20 right-4 z-40 flex size-13 items-center justify-center rounded-full bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="bottom" className="flex h-[75vh] flex-col border-zinc-800 bg-zinc-950 p-0">
        <SheetHeader className="border-b border-zinc-800 px-4 py-3">
          <SheetTitle className="text-sm font-semibold text-white">League Chat</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg) =>
              msg.system ? (
                <div
                  key={msg.id}
                  className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2"
                >
                  <Zap className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <p className="text-xs font-medium text-amber-300">{msg.message}</p>
                </div>
              ) : (
                <div key={msg.id} className="flex items-start gap-2.5">
                  <Avatar className="size-8 shrink-0 border border-zinc-700">
                    <AvatarFallback className="bg-zinc-800 text-[11px] font-semibold text-cyan-400">
                      {msg.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-xs font-semibold text-white">{msg.author}</p>
                      <p className="text-[11px] text-zinc-500">{msg.time}</p>
                    </div>
                    <p className="mt-0.5 rounded-2xl rounded-tl-sm bg-zinc-900 px-3 py-2 text-sm text-zinc-200">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <form
          className="flex items-center gap-2 border-t border-zinc-800 px-4 py-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Send a message..."
            className={cn(
              "flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500",
              "outline-none focus:border-cyan-400",
            )}
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-zinc-950"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
