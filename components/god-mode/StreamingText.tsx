import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface StreamingTextProps {
    content: string;
    isStreaming?: boolean;
    className?: string; // Add className prop for flexibility
}

export function StreamingText({ content, isStreaming = false, className }: StreamingTextProps) {
    // If not streaming, just show content
    if (!isStreaming) {
        return (
            <div className={`prose prose-invert prose-sm max-w-none ${className || ''}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        );
    }

    return (
        <div className={`relative ${className || ''}`}>
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {isStreaming && (
                <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse" style={{ verticalAlign: 'middle' }} />
            )}
        </div>
    );
}
