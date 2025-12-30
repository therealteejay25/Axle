'use client';

import { useEffect, useState } from 'react';
import { Webhook, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, Skeleton, EmptyState } from '@/components/ui/utils';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const data = await api.getWebhooks();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Webhook URL copied!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
          Webhooks
        </h1>
        <p className="text-[#8b8b8b]">
          Trigger agents via HTTP webhooks
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <EmptyState
          icon={<Webhook size={48} />}
          title="No webhooks yet"
          description="Webhooks are created automatically when you set up webhook triggers for your agents"
        />
      ) : (
        <div className="grid gap-4">
          {webhooks.map((webhook) => (
            <Card key={webhook._id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Webhook className="text-[#3ecf8e]" size={20} />
                    <h3 className="text-lg font-semibold">
                      {webhook.agentId?.name || 'Unknown Agent'}
                    </h3>
                    <Badge variant={webhook.enabled ? 'active' : 'paused'}>
                      {webhook.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#8b8b8b]">URL:</span>
                      <code className="text-xs bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a] flex-1">
                        {webhook.url || `${API_BASE}/api/v1/webhooks/${webhook._id}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyWebhookUrl(webhook.url || `${API_BASE}/api/v1/webhooks/${webhook._id}`)}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>

                    {webhook.lastCalledAt && (
                      <p className="text-sm text-[#8b8b8b]">
                        Last called: {new Date(webhook.lastCalledAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Example Payload */}
              <details className="mt-4">
                <summary className="text-sm text-[#3ecf8e] cursor-pointer hover:text-[#33b376]">
                  Show example payload
                </summary>
                <pre className="mt-2 text-xs bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a] overflow-x-auto">
{`POST ${webhook.url || `${API_BASE}/api/v1/webhooks/${webhook._id}`}
Content-Type: application/json

{
  "data": {
    "key": "value"
  }
}`}
                </pre>
              </details>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card variant="glass" className="p-6 mt-8">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-[#3ecf8e] flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold mb-2">How to use webhooks</h3>
            <ol className="text-sm text-[#8b8b8b] space-y-2 list-decimal list-inside">
              <li>Create a webhook trigger for an agent</li>
              <li>Copy the webhook URL from above</li>
              <li>Send POST requests to trigger the agent</li>
              <li>The payload will be available to the agent as input</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
