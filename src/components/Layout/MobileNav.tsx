import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Shield, 
  User,
  Info,
  GraduationCap
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

export function MobileNav() {
  const { isAdmin } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Hub', path: '/' },
    { icon: Briefcase, label: 'Projets', path: '/projects' },
    { icon: Shield, label: 'Sécurité', path: '/security' },
    { icon: isAdmin ? Shield : Info, label: isAdmin ? 'Admin' : 'Infos', path: isAdmin ? '/admin' : '/about' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] h-20 bg-hub-surface/90 border border-hub-border rounded-2xl flex items-center justify-around px-2 z-50 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-lg">
      <div className="absolute inset-0 cyber-grid opacity-10 rounded-2xl pointer-events-none" />
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => clsx(
            "flex flex-col items-center gap-1 transition-all duration-300 group relative py-2 px-4 rounded-xl",
            isActive ? "bg-brand-cyan/10 text-brand-cyan" : "text-slate-500"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={clsx("w-6 h-6", isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-tight text-center">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-cyan rounded-full shadow-[0_0_10px_rgba(0,242,255,0.8)]" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

