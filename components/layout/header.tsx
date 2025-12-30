'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex p-5 justify-end">
        <div className="flex p-2 pr-4 bg-white/2 border-2 border-white/3 rounded-full items-center gap-2">
            <Image src="/tayo.png" alt="Logo" width={30} height={30} />
            <div className="hidden md:block text-sm">
              <div className="font-medium">Tayo</div>
            </div>
            <ChevronDown size={15} />
        </div>
    </header>
  );
}
