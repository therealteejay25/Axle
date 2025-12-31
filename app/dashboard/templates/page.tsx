'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  RocketLaunch,
  Binoculars,
  GithubLogo,
  Globe,
  UserCircle,
  ChatCircleDots,
  Lightning,
  EnvelopeSimple,
  TrendUp,
  CalendarCheck,
  ShoppingCartSimple,
  Code,
  PresentationChart,
  Notepad,
  MegaphoneSimple,
  ChartBar,
  BookOpen,
  Buildings,
  DeviceMobileCamera
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/utils';

const iconPalette = [
  <RocketLaunch key="rocket" size={32} weight="duotone" className="text-orange-400" />,
  <Binoculars key="binoculars" size={32} weight="duotone" className="text-blue-400" />,
  <GithubLogo key="github" size={32} weight="duotone" className="text-white/60" />,
  <Globe key="globe" size={32} weight="duotone" className="text-emerald-400" />,
  <UserCircle key="user" size={32} weight="duotone" className="text-purple-400" />,
  <EnvelopeSimple key="email" size={32} weight="duotone" className="text-pink-400" />,
  <ChatCircleDots key="chat" size={32} weight="duotone" className="text-sky-400" />,
  <TrendUp key="trend" size={32} weight="duotone" className="text-lime-400" />,
  <Notepad key="notepad" size={32} weight="duotone" className="text-amber-400" />,
  <Code key="code" size={32} weight="duotone" className="text-cyan-400" />,
  <MegaphoneSimple key="megaphone" size={32} weight="duotone" className="text-red-400" />,
  <ChartBar key="chart" size={32} weight="duotone" className="text-fuchsia-400" />,
  <BookOpen key="book" size={32} weight="duotone" className="text-emerald-300" />,
  <Lightning key="bolt" size={32} weight="duotone" className="text-yellow-300" />,
  <Buildings key="buildings" size={32} weight="duotone" className="text-indigo-300" />,
  <CalendarCheck key="calendar" size={32} weight="duotone" className="text-teal-300" />,
  <PresentationChart key="presentation" size={32} weight="duotone" className="text-orange-300" />,
  <ShoppingCartSimple key="cart" size={32} weight="duotone" className="text-rose-300" />,
  <DeviceMobileCamera key="mobile" size={32} weight="duotone" className="text-sky-300" />,
];

const gradientPalette = [
  'from-orange-500/10 to-transparent',
  'from-blue-500/10 to-transparent',
  'from-white/10 to-transparent',
  'from-emerald-500/10 to-transparent',
  'from-purple-500/10 to-transparent',
  'from-pink-500/10 to-transparent',
  'from-sky-500/10 to-transparent',
  'from-lime-500/10 to-transparent',
  'from-amber-500/10 to-transparent',
  'from-cyan-500/10 to-transparent',
  'from-red-500/10 to-transparent',
  'from-fuchsia-500/10 to-transparent',
  'from-emerald-400/10 to-transparent',
  'from-yellow-400/10 to-transparent',
  'from-indigo-400/10 to-transparent',
  'from-teal-400/10 to-transparent',
  'from-rose-400/10 to-transparent',
  'from-violet-400/10 to-transparent'
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getTemplates();
        setTemplates(data.templates || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const decorated = useMemo(() => {
    return templates.map((t, idx) => {
      const icon = iconPalette[idx % iconPalette.length];
      const color = gradientPalette[idx % gradientPalette.length];
      const id = encodeURIComponent(t.name);
      return { ...t, id, icon, color };
    });
  }, [templates]);

  const filtered = decorated.filter(t =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl pb-40 mx-auto space-y-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Blueprints</h1>
          <p className="text-white/40 mt-1">Start with a pre-configured agent to save time.</p>
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
        {loading ? (
          <>
            <div className="md:col-span-2 lg:col-span-3">
              <div className="page-loader" style={{ minHeight: 140 }}>
                <div className="loader-light" />
                <div className="page-loader-text">Loading blueprints…</div>
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="h-full border border-white/5 bg-white/[0.01] p-8 rounded-3xl">
                <Skeleton className="h-10 w-10 rounded-2xl mb-6" />
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </>
        ) : (
          filtered.map((template) => (
            <Link key={template.id} href={`/dashboard/agents/new?template=${template.id}`}>
              <Card hover className={`h-full bg-gradient-to-b ${template.color} border border-white/5 hover:border-white/10 hover:bg-black/10 transition-all p-8 flex flex-col justify-between rounded-3xl group`}>
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
          ))
        )}

      </div>

    </div>
  );
}
