import { 
  Trophy, 
  Flame, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Code,
  Play,
  Calendar,
  Users,
  Terminal,
  Zap,
  Activity,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { projectService } from '../services/projectService';
import { Event, Project } from '../types';
import ProjectModal from './ProjectModal';
import { PWAInstaller } from './installation/PWAInstaller';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize if empty (for first run)
        if (isAdmin) {
          // Les données seront initialisées via l'interface admin
        }
        
        const [evs, projs] = await Promise.all([
          eventService.getEvents(),
          projectService.getProjects()
        ]);
        setEvents(evs);
        setProjects(projs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest animate-pulse">Chargement de la Matrice...</span>
      </div>
    );
  }

  return (
    <div className="relative space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* PWA Installer */}
      <PWAInstaller />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-brand-cyan animate-pulse" />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-brand-magenta animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-cyan/20" />
      </div>

      {/* Welcome & Top Stats */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 relative">
        <div className="relative">
          {/* Corner accent */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-brand-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-brand-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] font-bold">Statut Système : Opérationnel</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-black text-white tracking-tighter leading-none group">
            Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta group-hover:animate-pulse">{user?.name}</span>
          </h1>
          <p className="mt-6 text-slate-400 max-w-2xl text-lg font-medium border-l border-hub-border pl-6 py-2">
            Vous avez maintenu une <span className="text-brand-magenta font-black text-glow-magenta italic">séquence de 14 jours</span>. 
            La grille collective attend vos prochaines contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 w-full xl:w-auto">
          <div className="hub-card p-8 sm:flex-1 lg:w-[220px] bg-hub-surface/40 hover:bg-hub-surface-alt/40 transition-all border-l-2 border-brand-cyan group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-brand-cyan">Contributions</span>
              <Activity className="w-4 h-4 text-brand-cyan animate-pulse" />
            </div>
            <div className="text-4xl font-display font-black text-white text-glow-white">1,284</div>
            <div className="text-[10px] text-brand-emerald font-mono mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% SEPT DERNIERS JOURS
            </div>
          </div>
          <div className="hub-card p-8 sm:flex-1 lg:w-[220px] bg-hub-surface/40 hover:bg-hub-surface-alt/40 transition-all border-l-2 border-brand-magenta group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-brand-magenta">Rang Global</span>
              <Trophy className="w-4 h-4 text-brand-magenta" />
            </div>
            <div className="text-4xl font-display font-black text-white text-glow-white">#42</div>
            <div className="text-[10px] text-slate-400 font-mono mt-2 border-t border-hub-border pt-2">TOP 5% DU COLLECTIF</div>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Challenge - Left Span 8 */}
        <div className="lg:col-span-8 hub-card p-10 border-t-2 border-brand-cyan relative overflow-hidden group bg-hub-surface/40 hover:bg-hub-surface-alt/20 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[100px] rounded-full group-hover:bg-brand-cyan/10 transition-colors" />
          
          {/* Scanline effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-pulse" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20 group-hover:border-brand-cyan/50 transition-all">
                <Code className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight text-glow-white">Challenge Quotidien</h3>
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  Mission #042 • Niveau Intermédiaire
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] font-mono text-brand-cyan block font-bold">+500 XP</span>
                <span className="text-[8px] font-mono text-slate-600 block uppercase">Récompense Grille</span>
              </div>
              <button className="hub-button-primary bg-brand-cyan text-hub-bg border-none shadow-[0_0_20px_rgba(0,242,255,0.3)] py-3 px-6 text-xs font-black tracking-widest hover:bg-white hover:text-brand-cyan transition-all">LANCER_CORE</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-6">
              <h4 className="text-xl font-display font-black text-slate-100 italic tracking-tight">Inversion d'Arbre Récursive</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Implémentez un algorithme pour inverser un arbre binaire en temps O(n). Votre solution doit gérer les cas limites comme les nœuds nuls. 
                <span className="text-brand-cyan/60"> Analyse requise pour les grands jeux de données.</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Algorithmes', 'Arbre', 'O(n)', 'Recréation'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-hub-surface-alt/60 border border-hub-border rounded-md text-[9px] font-mono text-slate-400 uppercase tracking-widest hover:border-brand-cyan transition-colors">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-hub-bg/80 border border-hub-border/50 rounded-xl p-6 font-mono text-[11px] relative overflow-hidden group/code">
              <div className="absolute top-3 right-4 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <pre className="text-brand-emerald/90 leading-relaxed group-hover/code:text-brand-emerald transition-colors">
                <code>{`/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nvar invertTree = function(root) {\n  if (!root) return null;\n  \n  const right = invertTree(root.right);\n  const left = invertTree(root.left);\n  \n  root.left = right;\n  root.right = left;\n  \n  return root;\n};`}</code>
              </pre>
              <div className="absolute inset-0 bg-gradient-to-t from-hub-bg/95 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 right-4 text-[9px] text-slate-700 uppercase font-bold tracking-widest">TS_ENGINE_READY</div>
            </div>
          </div>
        </div>

        {/* Announcements - Right Span 4 */}
        <div className="lg:col-span-4 hub-card p-8 border-t-2 border-brand-magenta">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-magenta/10 rounded-lg">
                <Zap className="w-5 h-5 text-brand-magenta" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Annonces</h3>
            </div>
            <button className="text-[10px] font-mono text-slate-500 hover:text-brand-magenta transition-colors uppercase tracking-widest">Historique</button>
          </div>

          <div className="space-y-6">
            {[
              { time: 'Il y a 2h', title: 'Inscription Hackathon d\'Automne', desc: "Inscrivez-vous pour 'Cyber-Guard 2026' qui débute le mois prochain.", status: 'URGENT' },
              { time: 'Hier', title: 'Nouveau cours : Rust Avancé', desc: "Maîtrisez la gestion mémoire et l'exécution asynchrone.", status: 'NEW' },
              { time: 'Il y a 2 jours', title: 'Maintenance Système', desc: "Le terminal sera hors ligne pendant 30 minutes ce dimanche.", status: 'INFO' }
            ].map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-slate-500">{news.time}</span>
                  {news.status === 'URGENT' && <span className="w-1.5 h-1.5 bg-brand-magenta rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)]" />}
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-brand-magenta transition-colors">{news.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{news.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="hub-card p-10 bg-hub-surface/40 hover:bg-hub-surface-alt/20 transition-all group overflow-hidden border-none relative">
          <div className="absolute top-0 left-0 w-1 bg-brand-emerald scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-emerald/10 rounded-xl border border-brand-emerald/20 group-hover:border-brand-emerald/40 transition-all">
                <Terminal className="w-6 h-6 text-brand-emerald" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight text-glow-white">Secteurs Actifs</h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Surveillance des Missions de Guilde</span>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hub-button-ghost py-2 px-4 border border-hub-border text-[10px] font-black uppercase hover:text-brand-emerald hover:border-brand-emerald transition-all tracking-widest"
            >
              Nouveau_Projet
            </button>
          </div>

          <div className="space-y-8">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="group/item">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      proj.status === 'LIVE' ? 'bg-brand-emerald shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse' : 
                      proj.status === 'BUSY' ? 'bg-brand-cyan shadow-[0_0_12px_rgba(0,242,255,0.8)]' : 
                      'bg-brand-magenta shadow-[0_0_12px_rgba(217,70,239,0.8)]'
                    )} />
                    <span className="text-sm font-black text-white uppercase tracking-tight group-hover/item:text-glow-white transition-all">{proj.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-hub-bg rounded-none overflow-hidden border border-hub-border/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${proj.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={clsx(
                      "h-full rounded-r-none",
                      proj.status === 'LIVE' ? 'bg-gradient-to-r from-brand-emerald/40 to-brand-emerald' : 
                      proj.status === 'BUSY' ? 'bg-gradient-to-r from-brand-cyan/40 to-brand-cyan' : 
                      'bg-gradient-to-r from-brand-magenta/40 to-brand-magenta'
                    )} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-hub-border/30 text-center">
            <button className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] hover:text-brand-emerald transition-colors font-bold">ACCÉDER_AU_REGISTRE_COMPLET</button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="hub-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-cyan/10 rounded-lg">
                <Calendar className="w-5 h-5 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Chronologie</h3>
            </div>
          </div>

          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex gap-6 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-mono text-brand-cyan uppercase">{event.date.split(' ')[0]}</div>
                  <div className="text-xl font-display font-black text-white">{event.date.split(' ')[1]}</div>
                  <div className="w-[1px] h-full bg-hub-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="p-4 bg-hub-surface/30 border border-hub-border rounded-xl group-hover:border-brand-cyan/30 transition-all">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">{event.type}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-5 h-5 rounded-full border border-hub-bg bg-slate-800" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">+{event.registered} PARTICIPANTS</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProjects}
      />
    </div>
  );
}
