import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  User, 
  Shield, 
  Settings,
  CircleHelp,
  LogOut,
  Info,
  Users,
  BookOpen,
  Award
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

export function Sidebar() {
  const { user, isAdmin, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Hub Central', path: '/' },
    { icon: BookOpen, label: 'CODEL Library', path: '/library', badge: 'NEW' },
    { icon: Award, label: 'CODEL Academy', path: '/academy', badge: 'NEW' },
    { icon: GraduationCap, label: 'Académie', path: '/education' },
    { icon: Briefcase, label: 'Missions & Projets', path: '/projects' },
    { icon: Users, label: 'Communauté', path: '/community' },
    { icon: Shield, label: 'Registre Membres', path: '/security' },
    { icon: User, label: 'Profil Personnel', path: '/profile' },
    { icon: Info, label: 'À Propos', path: '/about' },
    ...(isAdmin ? [{ icon: Settings, label: 'Console Admin', path: '/admin' }] : [])
  ];

  const bottomItems = [
    { icon: Settings, label: 'Paramètres', path: '/settings' },
    { icon: CircleHelp, label: 'Support', path: '/support' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[80px] xl:w-[240px] bg-hub-bg border-r border-hub-border h-screen sticky top-0 z-50 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="w-10 h-10 bg-brand-cyan flex items-center justify-center rounded lg:shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          <Shield className="w-6 h-6 text-hub-bg" />
        </div>
        <div className="hidden xl:block overflow-hidden">
          <h1 className="font-display font-black text-xl tracking-tighter text-white whitespace-nowrap">CODEL HUB</h1>
          <p className="text-[10px] text-brand-cyan/60 font-mono tracking-widest leading-none">TERMINAL V1.0.4</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 mt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-4 px-3 py-3 rounded-lg transition-all group relative",
              isActive 
                ? "bg-brand-cyan/10 text-brand-cyan shadow-[inset_0_0_10px_rgba(0,242,255,0.1)]" 
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className="w-6 h-6 shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold bg-brand-magenta text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="hidden xl:block font-medium text-sm">{item.label}</span>
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-[-16px] w-1 h-6 bg-brand-cyan rounded-r-full shadow-[0_0_10px_rgba(0,242,255,0.8)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 mb-8 space-y-2">
        <div className="h-[1px] bg-hub-border mb-6" />
        
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-3 py-3 rounded-lg transition-all text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 group"
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden xl:block font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}

        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-slate-500 hover:text-brand-magenta hover:bg-brand-magenta/5 transition-all mt-4"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span className="hidden xl:block font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

