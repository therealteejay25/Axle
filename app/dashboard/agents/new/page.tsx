'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CaretLeft, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Suspense } from 'react';

function CreateAgentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');

    const [step, setStep] = useState<1 | 2>(1);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        instructions: ''
    });

    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly'>('daily');
    const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState<number>(1);
    const [scheduleHour, setScheduleHour] = useState<number>(9);
    const [scheduleAmPm, setScheduleAmPm] = useState<'AM' | 'PM'>('AM');

    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
    const [selectedWebhookEventId, setSelectedWebhookEventId] = useState<string>('github.push');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                if (!templateId) return;
                const data = await api.getTemplates();
                const templates = data.templates || [];
                const match = templates.find((t: any) => encodeURIComponent(t.name) === templateId);
                if (!match) return;

                const instructions = Array.isArray(match.actions)
                    ? `Use this action sequence as your playbook:\n\n${match.actions
                          .map((a: any, idx: number) => `${idx + 1}. ${a.type}`)
                          .join('\n')}`
                    : '';

                setFormData({
                    name: match.name || '',
                    description: match.description || '',
                    instructions
                });
            } catch (e) {
                console.error(e);
            }
        };
        loadTemplate();
    }, [templateId]);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const res = await api.getWebhookEvents();
                const events = res.events || [];
                setWebhookEvents(events);
                if (events.length > 0) setSelectedWebhookEventId(events[0].id);
            } catch (e) {
                console.error(e);
            }
        };
        loadProviders();
    }, []);

    const to24Hour = (hour: number, ampm: 'AM' | 'PM') => {
        const h = Math.max(1, Math.min(12, hour));
        if (ampm === 'AM') return h === 12 ? 0 : h;
        return h === 12 ? 12 : h + 12;
    };

    const buildCron = () => {
        const hour24 = to24Hour(scheduleHour, scheduleAmPm);
        if (scheduleFrequency === 'daily') return `0 ${hour24} * * *`;
        return `0 ${hour24} * * ${scheduleDayOfWeek}`;
    };

    const dayLabels: { value: number; label: string }[] = [
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
    ];

    const handleSubmit = async () => {
        if (!formData.name || !formData.instructions) return;

        setLoading(true);
        try {
            const { agent } = await api.createAgent({
                name: formData.name,
                description: formData.description,
                instructions: formData.instructions
            });

            const triggerCreates: Promise<any>[] = [];
            const selectedCron = buildCron();
            if (scheduleEnabled && selectedCron) {
                triggerCreates.push(
                    api.createTrigger({
                        agentId: agent._id,
                        type: 'schedule',
                        cronExpression: selectedCron,
                        enabled: true
                    })
                );
            }

            if (webhookEnabled) {
                const selected = webhookEvents.find((e: any) => e.id === selectedWebhookEventId);
                const source = selected?.source || selected?.id;
                triggerCreates.push(
                    api.createTrigger({
                        agentId: agent._id,
                        type: 'webhook',
                        config: { source },
                        enabled: true
                    })
                );
            }

            if (triggerCreates.length > 0) {
                await Promise.allSettled(triggerCreates);
            }

            router.push(`/dashboard/agents/${agent._id}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/dashboard/agents" className="text-sm text-white/40 hover:text-white mb-4 flex items-center gap-1 transition-colors">
                    <CaretLeft /> Back to Agents
                </Link>
                <h1 className="text-3xl font-semibold text-white tracking-tight">Create New Agent</h1>
                <p className="text-white/40 mt-1">Describe the role and responsibilities. The Agent handles the rest.</p>
            </div>

            <Card className="p-8 bg-black/20 border border-black/40 rounded-4xl space-y-6">
                {step === 1 ? (
                    <>
                        <Input
                            label="Agent Name"
                            placeholder="e.g. Research Assistant"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-black/30 rounded-full py-3 border-black/40"
                        />

                        <Input
                            label="Short Description"
                            placeholder="What does this agent do?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-black/30 rounded-full py-3 border-black/40"
                        />

                        <Textarea
                            label="Instructions"
                            placeholder="You are a helpful assistant. Your goal is to..."
                            helperText="Use natural language. No code or configuration needed."
                            rows={8}
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            className="bg-black/30 rounded-3xl outline-white/5 p-5 border-black/40 text-sm"
                        />

                        <div className="pt-4 flex justify-end gap-2">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!formData.name || !formData.instructions}
                                className="rounded-full transition-all duration-300 px-8 bg-base text-white hover:bg-base/90"
                            >
                                Next: Triggers
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="text-sm text-white/60">
                                Add triggers now (optional). You can always edit later from the Triggers page.
                            </div>

                            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-white/80">Schedule (Cron)</div>
                                        <div className="text-xs text-white/30">Run on a recurring schedule.</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setScheduleEnabled(!scheduleEnabled)}
                                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${scheduleEnabled ? 'bg-emerald-500/20' : 'bg-white/10'}`}
                                        aria-label="Toggle schedule trigger"
                                    >
                                        <div className={`w-4 h-4 rounded-full transition-all ${scheduleEnabled ? 'bg-emerald-400 ml-auto' : 'bg-white/20'}`} />
                                    </button>
                                </div>
                                {scheduleEnabled && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setScheduleFrequency('daily')}
                                                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                                                    scheduleFrequency === 'daily'
                                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                            >
                                                Daily
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setScheduleFrequency('weekly')}
                                                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                                                    scheduleFrequency === 'weekly'
                                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                            >
                                                Weekly
                                            </button>
                                        </div>

                                        {scheduleFrequency === 'weekly' && (
                                            <div className="grid grid-cols-7 gap-1">
                                                {dayLabels.map((d) => (
                                                    <button
                                                        key={d.value}
                                                        type="button"
                                                        onClick={() => setScheduleDayOfWeek(d.value)}
                                                        className={`px-2 py-2 rounded-xl border text-[11px] font-medium transition-colors ${
                                                            scheduleDayOfWeek === d.value
                                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {d.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <div className="text-xs text-white/30">Time</div>
                                            <select
                                                value={scheduleHour}
                                                onChange={(e) => setScheduleHour(parseInt(e.target.value, 10))}
                                                className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80"
                                            >
                                                {Array.from({ length: 12 }).map((_, i) => {
                                                    const h = i + 1;
                                                    return (
                                                        <option key={h} value={h}>{h}:00</option>
                                                    );
                                                })}
                                            </select>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setScheduleAmPm('AM')}
                                                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                                                        scheduleAmPm === 'AM'
                                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                                    }`}
                                                >
                                                    AM
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setScheduleAmPm('PM')}
                                                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                                                        scheduleAmPm === 'PM'
                                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                                    }`}
                                                >
                                                    PM
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-[11px] text-white/30">
                                            Will run: {scheduleFrequency === 'daily' ? 'Every day' : `Weekly on ${dayLabels.find(d => d.value === scheduleDayOfWeek)?.label || 'day'}`} at {scheduleHour}:00 {scheduleAmPm}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-white/80">Webhook Trigger</div>
                                        <div className="text-xs text-white/30">Trigger the agent from an external app.</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setWebhookEnabled(!webhookEnabled)}
                                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${webhookEnabled ? 'bg-emerald-500/20' : 'bg-white/10'}`}
                                        aria-label="Toggle webhook trigger"
                                    >
                                        <div className={`w-4 h-4 rounded-full transition-all ${webhookEnabled ? 'bg-emerald-400 ml-auto' : 'bg-white/20'}`} />
                                    </button>
                                </div>

                                {webhookEnabled && (
                                    <div className="space-y-2">
                                        <div className="text-xs text-white/30">Choose an event</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {(webhookEvents.length ? webhookEvents : [{ id: 'github.push', label: 'New commit pushed', description: 'Triggers when code is pushed to a repository.' }]).map((ev: any) => (
                                                <button
                                                    key={ev.id}
                                                    type="button"
                                                    onClick={() => setSelectedWebhookEventId(ev.id)}
                                                    className={`text-left px-3 py-2 rounded-xl border transition-colors ${
                                                        selectedWebhookEventId === ev.id
                                                            ? 'border-emerald-500/30 bg-emerald-500/10'
                                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className={`text-xs font-medium ${selectedWebhookEventId === ev.id ? 'text-emerald-200' : 'text-white/80'}`}>
                                                        {ev.label || ev.id}
                                                    </div>
                                                    <div className="text-[11px] text-white/30 line-clamp-2">
                                                        {ev.description || ''}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between gap-2">
                            <Button
                                onClick={() => setStep(1)}
                                className="rounded-full transition-all duration-300 px-8 bg-white/5 text-white hover:bg-white/10"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !formData.name || !formData.instructions}
                                loading={loading}
                                className="rounded-full transition-all duration-300 px-8"
                            >
                                Create Agent
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function CreateAgentPage() {
    return (
        <Suspense fallback={(
            <div className="page-loader">
                <div className="loader-light" />
                <div className="page-loader-text">Loading…</div>
            </div>
        )}>
            <CreateAgentContent />
        </Suspense>
    );
}
