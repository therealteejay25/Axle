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

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        instructions: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (templateId) {
            // Pre-fill based on template (Hardcoded for demo based on prompt requirements)
            const templates: Record<string, any> = {
                'product-launch': {
                    name: 'Product Launch Assistant',
                    description: 'Coordinates launch activities across channels.',
                    instructions: 'You are a product launch manager. Check GitHub for release status, then draft a Twitter announcement and a Slack message to the team.'
                },
                'research': {
                    name: 'Research Assistant',
                    description: 'Deep dives into topics and summarizes findings.',
                    instructions: 'You are a researcher. Search for the latest developments in the specified field, read the top 3 articles, and write a summary document.'
                },
                'github': {
                    name: 'GitHub Maintainer',
                    description: 'Triages issues and reviews PRs.',
                    instructions: 'You are a maintainer. List open issues in the repository, classify them by severity, and draft a summary report.'
                },
                'social': {
                    name: 'Social Media Manager',
                    description: 'Manages presence and engagement.',
                    instructions: 'You are a social media manager. Check the latest trends, draft 3 potential posts for X (Twitter) and Instagram, and schedule the best one.'
                },
                'executive': {
                    name: 'Executive Assistant',
                    description: 'Manages schedule and high-priority comms.',
                    instructions: 'You are an EA. Check my calendar for conflicts, read unread important emails, and draft items for my daily briefing.'
                }
            };

            const template = templates[templateId];
            if (template) {
                setFormData(template);
            }
        }
    }, [templateId]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.instructions) return;

        setLoading(true);
        try {
            const { agent } = await api.createAgent({
                name: formData.name,
                description: formData.description,
                instructions: formData.instructions
            });
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

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name || !formData.instructions}
                        className="rounded-full transition-all duration-300 px-8 bg-base text-white hover:bg-base/90"
                    >
                        {loading ? <div className="loader-light"></div> : 'Create Agent'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default function CreateAgentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateAgentContent />
        </Suspense>
    );
}
