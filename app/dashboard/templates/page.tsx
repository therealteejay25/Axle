'use client';

import { useState } from 'react';
import {
  Plus,
  RocketLaunch,
  Binoculars,
  GithubLogo,
  Globe,
  UserCircle
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const TEMPLATES = [
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'Marketing',
    description: 'Coordinate cross-channel announcements and PR updates.',
    icon: <RocketLaunch size={32} weight="duotone" className="text-orange-400" />,
    color: 'from-orange-500/10 to-transparent'
  },
  {
    id: 'research',
    name: 'Knowledge Base',
    category: 'Research',
    description: 'Synthesize complex topics from web content and documents.',
    icon: <Binoculars size={32} weight="duotone" className="text-blue-400" />,
    color: 'from-blue-500/10 to-transparent'
  },
  {
    id: 'github',
    name: 'Repo Maintainer',
    category: 'Engineering',
    description: 'Triage issues, review PRs, and draft release notes.',
    icon: <GithubLogo size={32} weight="duotone" className="text-white/60" />,
    color: 'from-white/10 to-transparent'
  },
  {
    id: 'social',
    name: 'Social Media Manager',
    category: 'Social',
    description: 'Manage engagement and post schedules across platforms.',
    icon: <Globe size={32} weight="duotone" className="text-emerald-400" />,
    color: 'from-emerald-500/10 to-transparent'
  },
  {
    id: 'executive',
    name: 'Executive Assistant',
    category: 'Personal',
    description: 'Calendar management, email triaging, and briefing.',
    icon: <UserCircle size={32} weight="duotone" className="text-purple-400" />,
    color: 'from-purple-500/10 to-transparent'
  }
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Blueprints</h1>
          <p className="text-white/40 mt-1">Start with a pre-configured role to save time.</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search templates..."
            className="bg-black/30 border border-black/50 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-black/70 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Custom Start */}
        <Link href="/dashboard/agents/new">
          <Card className="h-full border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all p-8 flex flex-col items-center justify-center text-center group rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Blank Slate</h3>
            <p className="text-sm text-white/30">Start from scratch for custom needs.</p>
          </Card>
        </Link>

        {/* Template Cards */}
        {filtered.map((template) => (
          <Link key={template.id} href={`/dashboard/agents/new?template=${template.id}`}>
            <Card className={`h-full bg-gradient-to-b ${template.color} border border-white/5 hover:border-white/10 hover:bg-black/10 transition-all p-8 flex flex-col justify-between rounded-3xl group`}>
              <div>
                <div className="mb-6 group-hover:-translate-y-1 transition-transform">
                  {template.icon}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-2">
                  {template.category}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{template.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white/60">Use Template</span>
                <Plus size={16} />
              </div>
            </Card>
          </Link>
        ))}

      </div>

    </div>
  );
}
