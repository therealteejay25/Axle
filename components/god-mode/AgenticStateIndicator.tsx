import { motion } from 'framer-motion';
import { Brain, Cpu, Database, Zap, Code2 } from 'lucide-react';

export type AgentState = 'idle' | 'thinking' | 'planning' | 'executing' | 'analyzing' | 'error';

interface AgenticStateIndicatorProps {
    state: AgentState;
    details?: string;
}

export function AgenticStateIndicator({ state, details }: AgenticStateIndicatorProps) {
    if (state === 'idle') return null;

    const config = {
        thinking: {
            icon: Brain,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            text: 'Thinking...',
            animation: 'animate-pulse-brain'
        },
        planning: {
            icon: Code2,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'Planning strategy...',
            animation: 'animate-pulse'
        },
        executing: {
            icon: Zap,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'Executing tools...',
            animation: 'animate-pulse'
        },
        analyzing: {
            icon: Database,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'Analyzing data...',
            animation: 'animate-scan-line'
        },
        error: {
            icon: Cpu,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'System Error',
            animation: ''
        }
    };

    const activeConfig = config[state] || config.thinking;
    const Icon = activeConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${activeConfig.bg} ${activeConfig.border}`}
        >
            <div className={`p-2 rounded-full bg-white/5 ${activeConfig.color} ${activeConfig.animation}`}>
                <Icon size={18} />
            </div>
            <div className="flex flex-col">
                <span className={`text-xs font-medium uppercase tracking-wider ${activeConfig.color}`}>
                    {activeConfig.text}
                </span>
                {details && (
                    <span className="text-sm text-white/70 line-clamp-1">
                        {details}
                    </span>
                )}
            </div>

            {/* Visual fluff: decorative bars */}
            <div className="ml-auto flex gap-1">
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className={`w-1 rounded-full ${activeConfig.color.replace('text-', 'bg-')} opacity-40`}
                    />
                ))}
            </div>
        </motion.div>
    );
}
