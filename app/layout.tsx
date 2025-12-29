import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Axle - AI-Powered Workflow Automation',
  description: 'Create intelligent agents that automate your workflows with 80+ integrations',
  icons: {icon: [{ url: "/logo.svg", type: "image/svg+xml" }]}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
