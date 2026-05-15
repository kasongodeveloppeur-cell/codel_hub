import { 
  Plus, 
  Github, 
  ChevronRight,
  GitPullRequest,
  Box,
  ExternalLink,
  Users,
  Search,
  Cpu,
  Layers,
  Database,
  Terminal,
  Activity,
  Loader2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusDistribution = [
    { name: 'LIVE', value: projects.filter(p => p.status === 'LIVE').length, color: '#10b981' },
    { name: 'BUSY', value: projects.filter(p => p.status === 'BUSY').length, color: '#00f2ff' },
    { name: 'STABLE', value: projects.filter(p => p.status === 'STABLE' || !p.status || p.status === 'COMPLETED').length, color: '#94a3b8' },
    { name: 'PAUSED', value: projects.filter(p => p.status === 'PAUSED').length, color: '#d946ef' },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest animate-pulse">Scan du Répertoire...</span>
      </div>
    );
  }
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-brand-magenta" />
            <span className="text-[10px] font-mono text-brand-magenta uppercase tracking-[0.4em]">Répertoire de Projets // Missions Actives</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none mb-6">
            Déploiements <span className="text-slate-500">du Club</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Naviguez dans la grille d'intelligence collective. Des actifs de niveau production aux concepts de laboratoire expérimentaux.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="hub-button-secondary py-3 px-6 flex items-center gap-2 border-hub-border hover:border-slate-600">
            <Github className="w-4 h-4" />
            Synchroniser GitHub
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hub-button-primary bg-brand-cyan text-hub-bg border-none shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Nouveau Projet
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        <div className="lg:col-span-8 space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 bg-hub-surface-alt/20 border border-hub-border rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-brand-cyan/5 blur-[60px] rounded-full" />
             {[
               { label: 'Sprints Actifs', value: '04', color: 'text-brand-cyan', icon: Activity },
               { label: 'Relais Ouverts', value: '12', color: 'text-brand-magenta', icon: GitPullRequest },
               { label: 'Déployés', value: '28', color: 'text-brand-emerald', icon: Cpu },
               { label: 'Nœuds', value: '156', color: 'text-white', icon: Users }
             ].map(stat => (
               <div key={stat.label} className="relative z-10 group">
                 <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-3 h-3 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
                 </div>
                 <div className={clsx("text-4xl font-display font-black group-hover:scale-110 transition-transform origin-left", stat.color)}>{stat.value}</div>
               </div>
             ))}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
             <div className="relative w-full md:w-[420px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="Rechercher dans le répertoire..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hub-input w-full pl-12 h-12 bg-hub-surface/50 border-hub-border focus:border-brand-cyan"
                />
             </div>
             <div className="flex gap-2">
                {['Tous', 'I.A', 'Web3', 'Architecture'].map(cat => (
                  <button key={cat} className="px-4 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors border border-transparent hover:border-hub-border rounded-lg">
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id} 
                className="hub-card group transition-all relative overflow-hidden"
                whileHover={{ y: -8 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${project.id}/800/600`} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hub-surface via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <span className={clsx(
                       "px-2 py-1 text-[9px] font-mono uppercase tracking-widest border border-white/20 backdrop-blur-md",
                       project.status === 'LIVE' ? 'text-brand-emerald' : 
                       project.status === 'BUSY' ? 'text-brand-cyan' : 'text-brand-magenta'
                     )}>
                       SYSTEM_{project.status}
                     </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Version 2.4.0-BETA</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight group-hover:text-glow-cyan transition-all">{project.title}</h3>
                     <Github className="w-5 h-5 text-slate-700 hover:text-white transition-colors cursor-pointer" />
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-4 mb-8 p-4 bg-hub-bg/50 border border-hub-border rounded-xl">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Intégrité Système</span>
                       <span className={clsx(
                         "text-xl font-display font-black",
                         project.status === 'LIVE' ? 'text-brand-emerald' : 'text-brand-cyan'
                       )}>{project.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-hub-surface-alt rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className={clsx(
                          "h-full transition-all duration-1000",
                          project.status === 'LIVE' ? 'bg-brand-emerald glow-emerald' : 
                          project.status === 'BUSY' ? 'bg-brand-cyan glow-cyan' : 'bg-brand-magenta glow-magenta'
                        )} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-hub-border">
                    <div className="flex items-center gap-3">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-hub-surface bg-slate-800" />
                          ))}
                       </div>
                       <span className="text-[10px] font-mono text-slate-600 uppercase">8 Opérateurs</span>
                    </div>
                    <button className="text-[10px] font-mono text-brand-cyan items-center gap-2 flex uppercase tracking-widest group">
                      Accéder aux Données
                      <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Context */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="hub-card p-8 border-t-2 border-brand-cyan relative overflow-hidden bg-hub-surface/40">
             <div className="absolute top-0 right-0 p-4">
                <PieChartIcon className="w-6 h-6 text-brand-cyan opacity-20" />
             </div>
             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-8">RÉPARTITION_SYSTÈME</h3>
             
             <div className="h-[200px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0f', 
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontFamily: 'monospace'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {statusDistribution.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{item.name}: {item.value}</span>
                  </div>
                ))}
             </div>
          </section>

          <section className="hub-card p-8 border-t-2 border-brand-cyan relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <Terminal className="w-6 h-6 text-brand-cyan opacity-20" />
             </div>
             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-8">JOURNAL_DES_LIAISONS</h3>
             <div className="space-y-6">
                {[
                  { msg: 'PR #102 FUSIONNÉE', time: '5M', user: '@kyle' },
                  { msg: 'SYNC_COEUR TERMINÉE', time: '12M', user: '@system' },
                  { msg: 'DESIGN U.I DÉPLOYÉ', time: '1H', user: '@sarah' },
                  { msg: 'SORTIE BETA v0.9', time: '4H', user: '@admin' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 relative pl-4 border-l border-hub-border py-1 group cursor-default">
                    <div className="absolute -left-[3px] top-2 w-1.5 h-1.5 bg-hub-border group-hover:bg-brand-cyan transition-colors" />
                    <div className="text-[11px]">
                       <p className="font-bold text-white uppercase leading-none group-hover:text-brand-cyan transition-colors">{log.msg}</p>
                       <p className="text-slate-600 mt-1 font-mono uppercase text-[9px]">{log.user} // IL Y A {log.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="hub-card p-10 flex flex-col items-center text-center border-t-2 border-brand-magenta">
             <div className="w-16 h-16 bg-brand-magenta/10 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-brand-magenta" />
             </div>
             <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mb-2">Ressources de la Station</h4>
             <p className="text-xs text-slate-500 mb-8 font-medium">85% de la capacité totale de la mission atteinte. Optimisez les déploiements.</p>
             <button className="hub-button-secondary w-full py-4 text-[10px] hover:border-brand-magenta/50 hover:text-brand-magenta transition-all">Optimiser la Grille</button>
          </section>

          <section className="p-8 hub-card border-none bg-hub-surface-alt/20 group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10">
               <h4 className="text-lg font-display font-black text-white uppercase tracking-tight mb-4">Infos Mission</h4>
               <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">Accédez aux schémas techniques et aux protocoles opérationnels dans la voûte chiffrée.</p>
               <button className="flex items-center gap-2 text-[10px] font-mono text-brand-cyan uppercase tracking-widest group">
                 Accès Voûte 
                 <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
               </button>
             </div>
          </section>
        </aside>
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProjects}
      />
    </div>
  );
}

