import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Headphones, Circle } from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { to: '/learn', icon: BookOpen, label: 'Apprendre' },
    { to: '/practice', icon: Calendar, label: 'Pratiquer' },
    { to: '/ear-training', icon: Headphones, label: 'Oreille' },
    { to: '/progress', icon: Circle, label: 'Progrès' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors',
                'text-muted-foreground hover:text-foreground',
                isActive && 'text-primary bg-primary/10'
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;