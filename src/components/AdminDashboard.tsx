import { 
  Users, 
  Settings, 
  ShieldAlert, 
  BarChart3, 
  FileText, 
  Database,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  PieChart,
  Shield,
  Activity,
  Terminal,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const roleColors: Record<string, string> = {
    'Président': 'bg-brand-magenta text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]',
    'Vice-Président': 'bg-brand-cyan text-hub-bg font-black shadow-[0_0_10px_rgba(0,242,255,0.3)]',
    'Secrétaire': 'bg-slate-700 text-slate-100',
    'Comptable': 'bg-brand-emerald text-hub-bg font-black shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    'Superviseur': 'bg-brand-slate text-brand-cyan',
    'Membre': 'bg-slate-300 text-slate-800'
  };

  return (
    <div className="relative space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Background scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 relative">
        <div className="relative">
           {/* Corner accent */}
           <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-brand-magenta shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
           
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-[1px] bg-brand-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
             <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] font-black">Admin Central // Exécutif</span>
           </div>
           <h1 className="text-5xl lg:text-7xl font-display font-black text-white tracking-tighter leading-none mb-6">
             Centre de <span className="text-slate-500 italic">Contrôle</span>
           </h1>
           <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-hub-surface-alt/40 border border-hub-border rounded-xl">
                <Shield className="w-4 h-4 text-brand-cyan" />
                <span className={clsx("text-xs font-mono uppercase tracking-[0.2em] font-bold", user?.clubRole === 'Président' ? 'text-brand-magenta' : 'text-brand-cyan')}>
                  {user?.clubRole || 'Membre'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                 <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 Liaison Sécurisée Active
              </div>
           </div>
        </div>
        <div className="flex gap-4 relative z-10 w-full lg:w-auto">
           <button className="hub-button-secondary py-4 px-10 border-hub-border hover:border-slate-600 flex-1 lg:flex-none uppercase tracking-widest font-bold text-[10px]">Exporter_Logs</button>
           <button className="hub-button-primary bg-brand-magenta text-hub-bg border-none shadow-[0_0_20px_rgba(217,70,239,0.4)] py-4 px-10 flex-1 lg:flex-none uppercase tracking-widest font-black">Actions_Globales</button>
        </div>
      </header>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Trésorerie', value: '1 250 €', change: '+12%', icon: Database, color: 'text-brand-emerald', glow: 'rgba(16,185,129,0.2)' },
          { label: 'Nœuds actifs', value: '156', change: '+5', icon: Users, color: 'text-brand-cyan', glow: 'rgba(0,242,255,0.2)' },
          { label: 'Secteurs', value: '24', change: '85%', icon: Briefcase, color: 'text-brand-magenta', glow: 'rgba(217,70,239,0.2)' },
          { label: 'Taux Uplink', value: '92%', change: '+4%', icon: TrendingUp, color: 'text-white', glow: 'rgba(255,255,255,0.1)' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="hub-card p-8 group hover:bg-hub-surface-alt/30 transition-all border-l-2 border-l-transparent hover:border-l-current overflow-hidden relative"
            style={{ color: stat.color === 'text-white' ? '#fff' : undefined } as any}
          >
            <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity opacity-0 group-hover:opacity-100" style={{ backgroundColor: stat.glow }} />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={clsx("w-12 h-12 flex items-center justify-center rounded-xl bg-hub-bg border border-hub-border group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-1 uppercase">{stat.change}</span>
            </div>
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 relative z-10">{stat.label}</h4>
            <div className="text-4xl font-display font-black text-white relative z-10 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className="hub-card border-t-2 border-brand-cyan overflow-hidden">
            <div className="p-8 lg:p-10 border-b border-hub-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Gestion des Autorités</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Vérifiez et effectuez la rotation des permissions pour les nœuds exécutifs.</p>
              </div>
              <div className="relative w-full md:w-72 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-cyan transition-colors" />
                <input type="text" placeholder="Filtrer les nœuds..." className="hub-input w-full pl-12 h-12 bg-hub-surface border-hub-border focus:border-brand-cyan text-sm" />
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-hub-surface/30 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-hub-border">
                  <tr>
                    <th className="px-10 py-5">Identité du Nœud</th>
                    <th className="px-10 py-5">Rôle Système</th>
                    <th className="px-10 py-5">Dernière Activité</th>
                    <th className="px-10 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hub-border">
                  {[
                    { name: 'Alex Rivera', role: 'Président', last: 'Il y a 2h', avatar: 'https://i.pravatar.cc/100?u=1' },
                    { name: 'Elena Vance', role: 'Vice-Président', last: 'Il y a 5h', avatar: 'https://i.pravatar.cc/100?u=2' },
                    { name: 'Marcus Aurel', role: 'Comptable', last: 'Hier', avatar: 'https://i.pravatar.cc/100?u=3' },
                    { name: 'Sarah Connor', role: 'Secrétaire', last: 'Il y a 3 jours', avatar: 'https://i.pravatar.cc/100?u=4' }
                  ].map((m) => (
                    <tr key={m.name} className="hover:bg-hub-surface-alt/30 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <img src={m.avatar} className="w-10 h-10 rounded-lg grayscale group-hover:grayscale-0 transition-all border border-hub-border" alt="" referrerPolicy="no-referrer" />
                          <div className="text-sm font-bold text-white uppercase group-hover:text-brand-cyan transition-colors">{m.name}</div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className={clsx("px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-md", roleColors[m.role])}>
                           {m.role}
                         </span>
                      </td>
                      <td className="px-10 py-6 text-xs text-slate-500 font-mono uppercase">{m.last}</td>
                      <td className="px-10 py-6 text-right">
                        <button className="p-2 text-slate-700 hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 border-t border-hub-border bg-hub-surface/20 text-center">
              <button className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] hover:text-brand-cyan transition-colors">Auditer toutes les opérations</button>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <section className="hub-card p-10 border-t-2 border-brand-magenta relative overflow-hidden bg-hub-surface/40">
             <div className="absolute top-0 right-0 p-4">
                <Terminal className="w-6 h-6 text-brand-magenta opacity-20" />
             </div>
             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-10">SECURE_LOG_CHIFFRÉ</h3>
             <div className="space-y-8 relative">
                <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-hub-border" />
                {[
                  { icon: ShieldAlert, text: 'Escalade de privilèges détectée', time: '10M', color: 'text-brand-magenta' },
                  { icon: FileText, text: 'Vecteur financier validé', time: '4H', color: 'text-brand-emerald' },
                  { icon: CheckCircle2, text: 'Déploiement nouvel actif approuvé', time: '12H', color: 'text-brand-cyan' },
                  { icon: AlertCircle, text: 'Tentative d\'accès non autorisé bloquée', time: 'HIER', color: 'text-brand-magenta' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-6 items-start relative z-10 group cursor-default">
                    <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center bg-hub-bg border border-hub-border shrink-0 transition-transform group-hover:scale-110", log.color)}>
                      <log.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase leading-normal group-hover:text-glow-cyan transition-all">{log.text}</p>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-1 tracking-widest">{log.time} // PRIORITÉ_{i === 0 ? 'HAUTE' : 'BASSE'}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="hub-card p-10 flex flex-col items-center text-center border-t-2 border-brand-cyan">
             <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-brand-cyan/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="w-8 h-8 text-brand-cyan relative z-10" />
             </div>
             <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mb-2">Charge Réseau</h4>
             <p className="text-xs text-slate-500 mb-8 font-medium">Capacité critique atteinte. Le secteur 09 subit une latence élevée.</p>
             <div className="w-full h-2 bg-hub-bg rounded-full mb-10 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "68%" }}
                   className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(0,242,255,0.4)]" 
                />
             </div>
             <button className="hub-button-secondary w-full py-4 text-[10px] border-hub-border hover:border-brand-cyan/50 hover:text-brand-cyan transition-all uppercase">Rééquilibrer la Grille</button>
          </section>
        </aside>
      </div>
    </div>
  );
}
