"use client"

import { useState, useRef, useEffect } from "react"
import { MessageBubble, type Message } from "@/components/message-bubble"

const INITIAL_MESSAGES: Message[] = [
    {
        id: "1",
        content: "E ai, ja viu o novo site da Vercel?",
        sender: "other",
        senderName: "Ana",
        timestamp: new Date(Date.now() - 300000),
    },
    {
        id: "2",
        content: "Nao, manda o link!",
        sender: "me",
        timestamp: new Date(Date.now() - 240000),
    },
    {
        id: "3",
        content: "Olha aqui: https://vercel.com - ta muito bom!",
        sender: "other",
        senderName: "Ana",
        timestamp: new Date(Date.now() - 180000),
    },
    {
        id: "4",
        content:
            "Muito legal! Eu estava lendo algo no https://github.com tambem, da uma olhada",
        sender: "me",
        timestamp: new Date(Date.now() - 120000),
    },
    {
        id: "5",
        content: "Vou ver agora! Tambem recomendo esse aqui https://nextjs.org para o projeto novo",
        sender: "other",
        senderName: "Ana",
        timestamp: new Date(Date.now() - 60000),
    },
    {
        id: "6",
        content: "Vou ver agora! Tambem recomendo esse aqui https://chabra.com.br",
        sender: "other",
        senderName: "Ana",
        timestamp: new Date(Date.now() - 40000),
    }
]

export default function ChatPage() {

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <main className="flex w-full min-h-svh flex-col bg-background">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </main>
    )
}
