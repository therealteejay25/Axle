'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import Image from 'next/image';

// New Agentic Components
import { StreamingText } from './StreamingText';
import { ToolExecutionCard } from './ToolExecutionCard';
import { AgenticStateIndicator, AgentState } from './AgenticStateIndicator';
import '@/app/god-agent.css'; // Import animations

interface ToolCall {
    id?: string; // unique id for list keys
    tool: string;
    params: any;
    status: 'pending' | 'running' | 'success' | 'error';
    result?: any;
    error?: any;
    startTime: number;
    endTime?: number;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    tools?: ToolCall[];
    timestamp?: string;
    isStreaming?: boolean; // For typewriter effect
}

export function GodAgentDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Agentic State
    const [agentState, setAgentState] = useState<AgentState>('idle');
    const [stateDetails, setStateDetails] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeThreadIndex, setActiveThreadIndex] = useState<number | null>(null);
    const [memorySummary, setMemorySummary] = useState<any | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
            loadMemorySummary();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, agentState, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadHistory = async () => {
        try {
            const history = await api.getChatHistory();
            if (history?.messages) {
                // Map legacy history to new format if needed
                const mappedMessages = history.messages.map((m: any) => ({
                    ...m,
                    isStreaming: false
                }));
                setMessages(mappedMessages);

                const lastUserIndex = [...history.messages]
                    .map((m: any, idx: number) => ({ m, idx }))
                    .filter(({ m }) => m.role === 'user')
                    .map(({ idx }) => idx)
                    .pop();
                if (typeof lastUserIndex === 'number') {
                    setActiveThreadIndex(lastUserIndex);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const loadMemorySummary = async () => {
        try {
            const live = await api.getLiveDashboardData();
            setMemorySummary(live);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);
        setAgentState('thinking');
        setStateDetails('Initializing God Agent protocol...');

        try {
            // New Assistant Message Structure
            let assistantMsg: Message = {
                role: 'assistant',
                content: '',
                tools: [],
                isStreaming: true
            };

            setMessages(prev => [...prev, assistantMsg]);

            await api.streamMessage(userMsg, (event: any) => {
                // Handle different event types from backend
                switch (event.type) {
                    case 'thinking':
                        setAgentState('thinking');
                        setStateDetails(event.data);
                        break;

                    case 'text_delta':
                        assistantMsg.content += event.data;
                        // Force update
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        break;

                    case 'tool_call':
                        setAgentState('executing');
                        setStateDetails(`Running ${event.data.tool}...`);
                        const newTool: ToolCall = {
                            tool: event.data.tool,
                            params: event.data.params,
                            status: 'running',
                            startTime: Date.now()
                        };
                        assistantMsg.tools = [...(assistantMsg.tools || []), newTool];
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        break;

                    case 'tool_result':
                        // Find the running tool and update it
                        if (assistantMsg.tools) {
                            const idx = assistantMsg.tools.findIndex(t => t.tool === event.data.tool && t.status === 'running');
                            if (idx !== -1) {
                                assistantMsg.tools[idx].status = 'success';
                                assistantMsg.tools[idx].result = event.data.result;
                                assistantMsg.tools[idx].endTime = Date.now();
                            } else {
                                // Fallback if we missed start event for some reason
                                assistantMsg.tools.push({
                                    tool: event.data.tool,
                                    params: {}, // Unknown
                                    status: 'success',
                                    result: event.data.result,
                                    startTime: Date.now(),
                                    endTime: Date.now()
                                });
                            }
                        }
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        // Go back to thinking or idle after tool
                        setAgentState('analyzing');
                        setStateDetails('Processing results...');
                        break;

                    case 'tool_error':
                        if (assistantMsg.tools) {
                            const idx = assistantMsg.tools.findIndex(t => t.tool === event.data.tool && t.status === 'running');
                            if (idx !== -1) {
                                assistantMsg.tools[idx].status = 'error';
                                assistantMsg.tools[idx].error = event.data.error;
                                assistantMsg.tools[idx].endTime = Date.now();
                            } else {
                                assistantMsg.tools.push({
                                    tool: event.data.tool,
                                    params: {},
                                    status: 'error',
                                    error: event.data.error,
                                    startTime: Date.now(),
                                    endTime: Date.now()
                                });
                            }
                        }
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        break;

                    case 'done':
                        assistantMsg.isStreaming = false;
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        setAgentState('idle');
                        break;

                    case 'error':
                        console.error('Stream Error:', event.data);
                        assistantMsg.content += `\n\n**Error:** ${event.data}`;
                        setMessages(prev => {
                            const newArr = [...prev];
                            newArr[newArr.length - 1] = { ...assistantMsg };
                            return newArr;
                        });
                        setAgentState('error');
                        break;
                }
            });

        } catch (error) {
            console.error('Chat failed:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
            setAgentState('error');
        } finally {
            setIsTyping(false);
            // setAgentState('idle'); // Handled by 'done' event usually
        }
    };

    // Derive conversational threads from message history
    const threads = useMemo(() => {
        const list: { start: number; end: number; title: string; startedAt?: string }[] = [];
        if (!messages.length) return list;

        let currentStart: number | null = null;
        messages.forEach((m, idx) => {
            if (m.role === 'user') {
                if (currentStart !== null) {
                    list.push({
                        start: currentStart,
                        end: idx,
                        title: messages[currentStart].content.slice(0, 40) || 'Conversation',
                        startedAt: messages[currentStart].timestamp,
                    });
                }
                currentStart = idx;
            }
        });
        if (currentStart !== null) {
            list.push({
                start: currentStart,
                end: messages.length,
                title: messages[currentStart].content.slice(0, 40) || 'Conversation',
                startedAt: messages[currentStart].timestamp,
            });
        }
        return list.slice(-5); // last N threads
    }, [messages]);

    const activeThread = useMemo(() => {
        if (!threads.length) return null;
        const idx =
            activeThreadIndex === null
                ? threads.length - 1
                : threads.findIndex(t => t.start === activeThreadIndex);
        return threads[idx >= 0 ? idx : threads.length - 1];
    }, [threads, activeThreadIndex]);

    const visibleMessages = useMemo(() => {
        if (!activeThread) return messages;
        return messages.slice(activeThread.start, activeThread.end);
    }, [messages, activeThread]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full my-auto w-full sm:w-[800px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-50 flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
                            <div className="flex items-center gap-3">
                                <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-6" />
                                <span className="font-bold text-white tracking-tight">GOD AGENT</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/20">GEMINI POWERED</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Threads Sidebar (Desktop) */}
                            <div className="hidden md:flex w-48 flex-col border-r border-white/5 bg-black/20 p-3 gap-2">
                                <div className="flex items-center justify-between mb-2 px-2">
                                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                                        Threads
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveThreadIndex(null)}
                                        className="text-[10px] text-purple-400 hover:text-purple-300"
                                    >
                                        NEW +
                                    </button>
                                </div>
                                <div className="space-y-1 overflow-y-auto custom-scrollbar">
                                    {threads.map((t, idx) => {
                                        const isActive =
                                            activeThread?.start === t.start ||
                                            (activeThreadIndex === null && idx === threads.length - 1);
                                        return (
                                            <button
                                                key={t.start}
                                                type="button"
                                                onClick={() => setActiveThreadIndex(t.start)}
                                                className={`w-full text-left rounded-lg px-3 py-2 text-[11px] transition-all ${isActive
                                                        ? 'bg-white/10 text-white font-medium'
                                                        : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                                                    }`}
                                            >
                                                <div className="truncate">{t.title}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0A0A0A] to-[#111]">
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                    {visibleMessages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                                            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 animate-pulse-brain">
                                                <Image src="/logo.svg" alt="Axle" width={40} height={40} className="invert opacity-80" />
                                            </div>
                                            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 mb-3">
                                                Axle God Agent
                                            </h3>
                                            <p className="text-white/40 max-w-sm mb-8 text-sm leading-relaxed">
                                                I have complete control over your specific Axle environment.
                                                Ask me to create agents, check executions, or manage your integrations.
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                                                {["Create a Twitter bot", "List my failed executions", "Pause all agents", "Show me analytics"].map(suggest => (
                                                    <button
                                                        key={suggest}
                                                        onClick={() => setInput(suggest)}
                                                        className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-xs text-white/60 transition-all text-left"
                                                    >
                                                        {suggest}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {visibleMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-white to-gray-300 transform rotate-3'
                                                    : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                                                }`}>
                                                {msg.role === 'user' ? (
                                                    <User size={14} className="text-black" />
                                                ) : (
                                                    <Image src="/logo.svg" alt="Logo" width={16} height={16} className="invert" />
                                                )}
                                            </div>

                                            <div className={`space-y-4 max-w-[85%] min-w-0 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                                                {/* Text Content */}
                                                {msg.content && (
                                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                            ? 'bg-white text-black rounded-tr-sm font-medium'
                                                            : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/5 backdrop-blur-md'
                                                        }`}>
                                                        {msg.role === 'assistant' ? (
                                                            <StreamingText content={msg.content} isStreaming={msg.isStreaming} />
                                                        ) : (
                                                            msg.content
                                                        )}
                                                    </div>
                                                )}

                                                {/* Tool Executions (Assistant Only) */}
                                                {msg.tools && msg.tools.length > 0 && (
                                                    <div className="w-full space-y-2 mt-2">
                                                        {msg.tools.map((tool, tIdx) => (
                                                            <ToolExecutionCard
                                                                key={tool.id || tIdx}
                                                                toolName={tool.tool}
                                                                params={tool.params}
                                                                status={tool.status}
                                                                result={tool.result}
                                                                error={tool.error}
                                                                startTime={tool.startTime}
                                                                endTime={tool.endTime}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Active State Indicator (When streaming/thinking) */}
                                    {isTyping && (
                                        <div className="ml-12 max-w-md">
                                            <AgenticStateIndicator state={agentState} details={stateDetails} />
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Floating Action Bar / Input */}
                                <div className="p-6 pt-0 bg-transparent">
                                    <div className="relative group max-w-4xl mx-auto">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2 transition-all group-focus-within:border-white/20 group-focus-within:ring-1 group-focus-within:ring-white/10">
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Give me a task..."
                                                className="bg-transparent border-none text-white placeholder:text-white/30 h-12 px-4 focus-visible:ring-0 text-base shadow-none"
                                                autoFocus
                                            />
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={!input.trim() || isTyping}
                                                className={`h-10 w-10 p-0 rounded-xl transition-all ${input.trim() ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-white/5 text-white/20'
                                                    }`}
                                            >
                                                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Footer / Memory Stats */}
                                    <div className="max-w-4xl mx-auto mt-3 flex justify-between items-center px-2 text-[10px] text-white/20 uppercase tracking-widest font-mono">
                                        <span>Axle God Agent v2.0</span>
                                        <div className="flex gap-4">
                                            <span>Executions: {memorySummary?.analytics?.totalExecutions ?? '-'}</span>
                                            <span>Model: Gemini 2.0 Flash</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
