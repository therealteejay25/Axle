
// components/chat/renderers/slack/SlackChannelCard.tsx
'use client';

import React from 'react';
import { Hash, Lock, Users, Plus, CheckCircle2 } from 'lucide-react';

interface SlackChannelCardProps {
  data: {
    channelName?: string;
    description?: string;
    isPrivate?: boolean;
    members?: string[];
    purpose?: string;
  };
  onCreate?: (data: any) => void;
}

export default function SlackChannelCard({ data, onCreate }: SlackChannelCardProps) {
  const channelName = data.channelName || 'new-channel';
  const description = data.description || '';
  const isPrivate = data.isPrivate || false;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-gray-900 to-black shadow-2xl shadow-purple-500/10 max-w-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />
      
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/40 blur-xl rounded-full" />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Create Slack Channel</h3>
            <p className="text-xs text-purple-300/70">New workspace channel</p>
          </div>
        </div>
      </div>

      {/* Channel Details */}
      <div className="relative px-6 py-5 space-y-4">
        {/* Channel Name */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
            Channel Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-purple-400" />
              ) : (
                <Hash className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div className="w-full pl-11 pr-4 py-3 bg-black/40 border border-purple-500/20 rounded-xl text-white font-mono">
              {channelName}
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div>
            <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <div className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-xl text-white text-sm">
              {description}
            </div>
          </div>
        )}

        {/* Privacy Info */}
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            {isPrivate ? (
              <Lock className="w-4 h-4 text-purple-400" />
            ) : (
              <Hash className="w-4 h-4 text-purple-400" />
            )}
            <span className="text-sm font-semibold text-white">
              {isPrivate ? 'Private Channel' : 'Public Channel'}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {isPrivate 
              ? 'Only invited members can view and join this channel'
              : 'Anyone in the workspace can view and join this channel'
            }
          </p>
        </div>

        {/* Members Preview */}
        {data.members && data.members.length > 0 && (
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Initial Members ({data.members.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {member?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-purple-200">{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative px-6 py-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-transparent">
        <div className="flex items-center gap-2 text-xs text-purple-300/70">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Channel ready • Reply "go ahead" or "continue" to create</span>
        </div>
      </div>
    </div>
  );
}