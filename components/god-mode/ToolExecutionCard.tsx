import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, XCircle, ChevronDown, ChevronRight, Loader2, Play } from 'lucide-react';

interface ToolExecutionCardProps {
    toolName: string;
    params: any;
    status: 'pending' | 'running' | 'success' | 'error';
    result?: any;
    error?: any;
    startTime?: number;
    endTime?: number;
}

export function ToolExecutionCard({ toolName, params, status, result, error, startTime, endTime }: ToolExecutionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate duration
    const duration = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) + 's' : null;

    return (
        <div className="w-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm">
            {/* Header */}
            <div
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={`p-1.5 rounded-md ${status === 'running' ? 'bg-purple-500/20 text-purple-400' :
                        status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                            status === 'error' ? 'bg-red-500/20 text-red-400' :
                                'bg-white/10 text-white/40'
                    }`}>
                    {status === 'running' ? <Loader2 size={14} className="animate-spin" /> :
                        status === 'success' ? <CheckCircle2 size={14} /> :
                            status === 'error' ? <XCircle size={14} /> :
                                <Terminal size={14} />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white/80">{toolName}</span>
                        {duration && <span className="text-[10px] text-white/30 px-1.5 py-0.5 rounded-full border border-white/5 bg-white/5">{duration}</span>}
                    </div>
                    {!isExpanded && (
                        <div className="text-[11px] text-white/40 truncate font-mono mt-0.5">
                            {JSON.stringify(params)}
                        </div>
                    )}
                </div>

                <div className="text-white/30">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/40 border-t border-white/10"
                    >
                        <div className="p-3 space-y-3 text-xs font-mono">
                            {/* Inputs */}
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1 flex items-center gap-1">
                                    <Play size={10} /> Input
                                </div>
                                <div className="p-2 rounded bg-black/50 border border-white/5 text-purple-300 overflow-x-auto">
                                    <code>{JSON.stringify(params, null, 2)}</code>
                                </div>
                            </div>

                            {/* Outputs */}
                            {(result || error) && (
                                <div>
                                    <div className={`text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1 ${error ? 'text-red-400/50' : 'text-emerald-400/50'}`}>
                                        {error ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
                                        {error ? 'Error' : 'Output'}
                                    </div>
                                    <div className={`p-2 rounded bg-black/50 border overflow-x-auto ${error ? 'border-red-500/20 text-red-300' : 'border-emerald-500/20 text-emerald-300'}`}>
                                        <code>{JSON.stringify(error || result, null, 2)}</code>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
