'use client';

import { useEffect, useState } from 'react';
import { Plus, Clock, Webhook, Play, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, Skeleton, EmptyState } from '@/components/ui/utils';
import { Modal } from '@/components/ui/modal';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTrigger, setNewTrigger] = useState({
    agentId: '',
    type: 'manual',
    cronExpression: '',
    enabled: true,
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [triggersData, agentsData] = await Promise.all([
        api.getTriggers(),
        api.getAgents()
      ]);
      setTriggers(triggersData.triggers || []);
      setAgents(agentsData.agents || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrigger = async () => {
    if (!newTrigger.agentId) {
      showToast('error', 'Please select an agent');
      return;
    }

    try {
      await api.createTrigger(newTrigger);
      await fetchData();
      setModalOpen(false);
      setNewTrigger({ agentId: '', type: 'manual', cronExpression: '', enabled: true });
      showToast('success', 'Trigger created!');
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const handleToggleTrigger = async (trigger: any) => {
    try {
      await api.updateTrigger(trigger._id, { enabled: !trigger.enabled });
      await fetchData();
      showToast('success', `Trigger ${!trigger.enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (!confirm('Delete this trigger?')) return;
    try {
      await api.deleteTrigger(id);
      await fetchData();
      showToast('success', 'Trigger deleted');
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
            Triggers
          </h1>
          <p className="text-[#8b8b8b]">
            Schedule and automate your agents
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => setModalOpen(true)}
        >
          Create Trigger
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : triggers.length === 0 ? (
        <EmptyState
          icon={<Clock size={48} />}
          title="No triggers yet"
          description="Create your first trigger to automate agent execution"
          action={
            <Button variant="primary" icon={<Plus size={20} />} onClick={() => setModalOpen(true)}>
              Create Trigger
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {triggers.map((trigger) => (
            <Card key={trigger._id} hover className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {trigger.type === 'schedule' ? (
                      <Clock className="text-[#3ecf8e]" size={20} />
                    ) : trigger.type === 'webhook' ? (
                      <Webhook className="text-[#3ecf8e]" size={20} />
                    ) : (
                      <Play className="text-[#3ecf8e]" size={20} />
                    )}
                    <h3 className="text-lg font-semibold">
                      {trigger.agentId?.name || 'Unknown Agent'}
                    </h3>
                    <Badge variant={trigger.enabled ? 'active' : 'paused'}>
                      {trigger.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge>{trigger.type}</Badge>
                  </div>
                  
                  {trigger.type === 'schedule' && trigger.cronExpression && (
                    <p className="text-sm text-[#8b8b8b]">
                      Schedule: <code className="text-[#3ecf8e]">{trigger.cronExpression}</code>
                    </p>
                  )}
                  
                  {trigger.type === 'webhook' && trigger.webhookUrl && (
                    <p className="text-sm text-[#8b8b8b]">
                      URL: <code className="text-xs">{trigger.webhookUrl}</code>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleTrigger(trigger)}
                  >
                    {trigger.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrigger(trigger._id)}
                  >
                    <Trash2 size={16} className="text-[#f04438]" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Trigger Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header onClose={() => setModalOpen(false)}>
          Create New Trigger
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Select
              label="Agent"
              value={newTrigger.agentId}
              onChange={(e: any) => setNewTrigger({ ...newTrigger, agentId: e.target.value })}
              options={[
                { value: '', label: 'Select an agent' },
                ...agents.map(a => ({ value: a._id, label: a.name }))
              ]}
            />
            
            <Select
              label="Trigger Type"
              value={newTrigger.type}
              onChange={(e: any) => setNewTrigger({ ...newTrigger, type: e.target.value })}
              options={[
                { value: 'manual', label: 'Manual' },
                { value: 'schedule', label: 'Schedule (Cron)' },
                { value: 'webhook', label: 'Webhook' },
              ]}
            />

            {newTrigger.type === 'schedule' && (
              <Input
                label="Cron Expression"
                placeholder="0 9 * * *"
                value={newTrigger.cronExpression}
                onChange={(e) => setNewTrigger({ ...newTrigger, cronExpression: e.target.value })}
                helperText="e.g., '0 9 * * *' = Every day at 9 AM"
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateTrigger} icon={<Plus size={20} />}>
            Create Trigger
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
