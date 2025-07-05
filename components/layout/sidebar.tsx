'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  CreditCard, 
  PiggyBank, 
  Settings, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/dashboard',
  },
  {
    title: 'Transactions',
    icon: CreditCard,
    href: '/transactions',
  },
  {
    title: 'Budgets',
    icon: PiggyBank,
    href: '/budgets',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-card border-r border-border transition-transform duration-300',
          'md:translate-x-0 md:static md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">FinanceViz</span>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 h-12',
                        isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}