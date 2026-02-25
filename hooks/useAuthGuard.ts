'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken } from '@/lib/api';

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);
}
