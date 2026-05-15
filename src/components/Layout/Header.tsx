import { Search, Bell, Monitor, ChevronRight, Shield } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(p => p);
    if (path.length === 0) return 'Tableau de Bord';
    
    const translations: { [key: string]: string } = {
      'education': 'Éducation',
      'projects': 'Projets',
      'community': 'Communauté',
      'profile': 'Profil',
      'security': 'Sécurité',
      'about': 'À Propos',
      'admin': 'Administration'
    };

    return (
      <div className="flex items-center gap-2">
        <span className="capitalize">{translations[path[0]] || path[0]}</span>
        {path.length > 1 && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-500 capitalize">{path[1]}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <header className="h-20 border-b border-hub-border bg-hub-bg/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 sm:gap-8 flex-1">
        <div className="lg:hidden flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-cyan flex items-center justify-center rounded shadow-[0_0_10px_rgba(0,242,255,0.3)]">
             <Shield className="w-5 h-5 text-hub-bg" />
           </div>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-white font-display font-bold text-xl">{getBreadcrumbs()}</h2>
        </div>

        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-hub-surface/50 border border-hub-border rounded-lg pl-10 sm:pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/10 transition-all placeholder:text-slate-600 sm:placeholder:text-slate-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-hub-border bg-hub-bg text-[10px] text-slate-500 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-hub-border bg-hub-bg text-[10px] text-slate-500 font-mono">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <button className="p-2 hover:text-brand-cyan transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-magenta rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          </button>
          <button className="p-2 hover:text-brand-cyan transition-colors">
            <Monitor className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-hub-border mx-2" />

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-brand-cyan font-mono tracking-tighter uppercase">{user.clubRole}</p>
            </div>
            <div className="w-10 h-10 rounded-lg border border-hub-border p-0.5 glow-cyan transition-transform hover:scale-105 cursor-pointer">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover rounded-md grayscale hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
