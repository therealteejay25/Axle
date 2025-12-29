'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Trash, Bot, User, Terminal, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    tools?: any[]; // Array of tool executions
}

export function GodAgentDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentTool, setCurrentTool] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentTool, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadHistory = async () => {
        try {
            const history = await api.getChatHistory();
            if (history?.messages) {
                setMessages(history.messages);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const clearHistory = async () => {
        await api.clearChatHistory();
        setMessages([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch(`${api.baseURL}/chatbot/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${local_getCookie('token')}` // Helper needed or use api wrapper differently
                },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let assistantMsg = { role: 'assistant', content: '', tools: [] } as Message;

            // Initialize assistant message placeholder
            setMessages(prev => [...prev, assistantMsg]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(line.slice(6));

                            if (event.type === 'text') {
                                assistantMsg.content += event.data;
                                // Force update last message
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMsg }]);
                            } else if (event.type === 'tool_start') {
                                setCurrentTool({ ...event.data, status: 'running' });
                            } else if (event.type === 'tool_result') {
                                setCurrentTool(null);
                                assistantMsg.tools = [...(assistantMsg.tools || []), { ...event.data, status: 'success' }];
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMsg }]);
                            } else if (event.type === 'tool_error') {
                                setCurrentTool(null);
                                assistantMsg.tools = [...(assistantMsg.tools || []), { ...event.data, status: 'error' }];
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMsg }]);
                            }
                        } catch (e) {
                            console.error("Parse error", e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Chat failed:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsTyping(false);
            setCurrentTool(null);
        }
    };

    // Quick helper to get token
    const local_getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full my-auto w-full sm:w-[500px] bg-white/5 backdrop-blur-lg shadow-2xl z-50 flex flex-col"
                    >
                        

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="flex flex-col justify-center px-7 h-full text-white/30">
                                    <h3 className="text-white font-bold text-[44px]">Hello Tayo,</h3>
                                    <p>How can I help you today?</p>
                                    
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-black/40'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-4" />}
                                    </div>
                                    <div className={`space-y-2 max-w-[85%] ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-black rounded-tr-sm' : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/5'}`}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>

                                        {/* Tools displayed for assistant */}
                                        {msg.tools && msg.tools.map((tool, tIdx) => (
                                            <div key={tIdx} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs w-full font-mono">
                                                <div className="flex items-center gap-2 mb-2 text-white/60">
                                                    <Terminal size={12} />
                                                    <span className='uppercase'>{tool.tool}</span>
                                                    {tool.status === 'success' ? <CheckCircle2 size={12} className="text-green-400 ml-auto" /> : <AlertCircle size={12} className="text-red-400 ml-auto" />}
                                                </div>
                                                <div className="text-white/40 break-all">
                                                    {JSON.stringify(tool.result || tool.error).slice(0, 100)}...
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Active Tool Indicator */}
                            {currentTool && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                        <Loader2 size={16} className="animate-spin" />
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-3 flex items-center gap-3">
                                        <div className="text-sm text-white/70">Running <span className="font-mono text-purple-400 bg-purple-500/10 px-1 rounded">{currentTool.tool}</span>...</div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="relative">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message or command..."
                                    className="bg-black/50 border-black/70 text-white pr-12 h-12 rounded-full focus:ring-base/20"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-1 top-1 w-10 h-10 flex items-center bg-base text-white hover:bg-base/90 rounded-full transition-colors"
                                >
                                    {isTyping ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
