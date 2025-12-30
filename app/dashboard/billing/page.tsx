'use client';

import { useEffect, useState } from 'react';
import {
  Lightning,
  ArrowSquareOut,
  Receipt,
  DownloadSimple,
} from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/utils';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Subscription, Plan, Invoice } from '@/types';

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subData, plansData, invoicesData] = await Promise.all([
          api.getSubscription(),
          api.getPlans(),
          api.getInvoices(),
        ]);

        setSubscription(subData.subscription);
        setPlans(plansData.plans);
        setInvoices(invoicesData.invoices);
      } catch (err) {
        console.error('Billing fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    const { url } = await api.createCheckout(planId);
    window.location.href = url;
  };

  const handleManageSubscription = async () => {
    const { url } = await api.getPortalLink();
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const creditsPercent =
    ((subscription?.credits || 0) /
      (subscription?.creditsLimit || 1)) *
    100;

  return (
    <div className="max-w-5xl space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-white/40">
          Plan, credits, and payment history
        </p>
      </header>

      {/* Current Plan */}
      <Card className="p-6 bg-[#0E0E0E] border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
              Current plan
            </p>
            <h2 className="text-3xl font-semibold">
              {subscription?.planName || 'Free'}
            </h2>
            <p className="mt-2 text-sm text-white/40 max-w-md">
              {subscription?.summaryText}
            </p>
          </div>

          {subscription?.status === 'active' && (
            <Button
              variant="ghost"
              onClick={handleManageSubscription}
              className="gap-2"
            >
              <ArrowSquareOut size={16} />
              Manage
            </Button>
          )}
        </div>
      </Card>

      {/* Credits */}
      <Card className="p-6 bg-[#0E0E0E] border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightning size={18} className="text-[#36B460]" />
            <span className="font-medium">Automation Credits</span>
          </div>
          <span className="text-sm text-white/40">
            {subscription?.credits} / {subscription?.creditsLimit}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#36B460] transition-all"
            style={{ width: `${creditsPercent}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-white/40">
          Credits power agent runs, triggers, and background execution.
        </p>
      </Card>

      {/* Upgrade */}
      <section>
        <h3 className="text-lg font-medium mb-4">Upgrade your plan</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === subscription?.plan;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'p-5 bg-[#0E0E0E] border transition-all',
                  isCurrent
                    ? 'border-[#36B460]/40'
                    : 'border-white/5'
                )}
              >
                <div className="mb-4">
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-sm text-white/40">
                    {plan.priceText}
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant={isCurrent ? 'secondary' : 'primary'}
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrent ? 'Current plan' : 'Upgrade'}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Invoices */}
      {invoices.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-4">Invoices</h3>

          <Card className="bg-[#0E0E0E] border border-white/5">
            <div className="divide-y divide-white/5">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <Receipt size={18} className="text-white/40" />
                    <div>
                      <p className="text-sm font-medium">
                        {invoice.description}
                      </p>
                      <p className="text-xs text-white/40">
                        {invoice.dateText}
                      </p>
                    </div>
                  </div>

                  {invoice.pdfUrl && (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <DownloadSimple size={16} />
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
