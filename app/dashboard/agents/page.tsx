'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Play, Pause, CaretRight, Robot } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/lib/utils';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Create a manual execution and redirect to it (or just run in background)
      // Requirements say "View, Run, Pause" on card.
      // Usually "Run" opens a dialog or input. 
      // Requirement "EXECUTION VIEW" implies running takes you there or shows status.
      // But "AGENT DETAIL" has a "Run Agent" panel.
      // I'll make "Run" here redirect to the Agent Detail "Run" section or just let them click the card to go to detail.
      // Let's make "Run" generic for now (maybe skip implementation on list if complex input needed).
      // Actually, standard Pattern: Click card -> View.
      // I'll keep the buttons but maybe "Run" redirects to detail page run section.
      router.push(`/dashboard/agents/${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (e: React.MouseEvent, agent: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    await api.updateAgent(agent._id, { status: newStatus });
    setAgents(agents.map(a => a._id === agent._id ? { ...a, status: newStatus } : a));
  };

  if (loading) return <div className="p-8 text-white/20 animate-pulse">Loading workforce...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Your Agents</h1>
          <p className="text-white/40 mt-1">Manage and monitor your AI agents.</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button className="bg-base text-black cursor-pointer py-2.5 hover:bg-base/90 rounded-full px-6">
            <Plus weight="bold" className="size-4" />
            New Agent
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Link key={agent._id} href={`/dashboard/agents/${agent._id}`} className="block group">
            <Card className="h-full bg-base/5 border border-white/5 hover:border-white/10 hover:bg-base/10 transition-all p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-base/5 rounded-xl text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                    <Robot size={24} weight="duotone" />
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${agent.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                    {agent.status === 'active' ? 'Active' : 'Paused'}
                  </div>
                </div>

                <h3 className="text-lg font-medium text-white mb-2">{agent.name}</h3>
                <p className="text-sm text-white/50 line-clamp-2 h-10 ml-0.5">
                  {agent.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {agent.lastRunAt ? `Ran ${safeFormatDistanceToNow(agent.lastRunAt, { addSuffix: true })}` : 'Never ran'}
                </span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => toggleStatus(e, agent)}
                    className="p-1.5 hover:bg-base/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    title={agent.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {agent.status === 'active' ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                  </button>
                  <div className="p-1.5 hover:bg-base/10 rounded-lg text-white/60 hover:text-white transition-colors">
                    <CaretRight size={16} weight="bold" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {/* Empty State / Add New Card */}
        <Link href="/dashboard/agents/new" className="block group">
          <div className="h-full min-h-[240px] border border-dashed border-base/25 rounded-2xl flex flex-col items-center justify-center text-white/20 hover:text-white/40 hover:border-base/50 transition-all bg-base/2 hover:bg-base/5">
            <Plus size={32} />
            <span className="mt-2 font-medium">Deploy New Agent</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
