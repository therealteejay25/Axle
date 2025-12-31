"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-loader" style={{ minHeight: 'auto' }}>
        <div className="loader-light" />
        <div className="page-loader-text">Redirecting…</div>
      </div>
    </div>
  );
}
